from pathlib import Path
from PIL import Image, ImageDraw, ImageChops
import json
ROOT=Path(__file__).resolve().parents[3]
BUST=ROOT/'xiaotong/bust'
OUT=Path(__file__).resolve().parent
names=['gaze-c','gaze-l','gaze-r','gaze-u','gaze-d','gaze-ul','gaze-ur','gaze-dl','gaze-dr','blink-1','blink-2','talk-1','talk-2','talk-3','hello','happy','think','card']
base=Image.open(BUST/'gaze-c.png').convert('RGBA')
results=[]
board=Image.new('RGB',(6*256,3*282),'#eeeeee')
d=ImageDraw.Draw(board)
for idx,name in enumerate(names):
 p=BUST/f'{name}.png'
 if not p.exists():
  results.append({'file':str(p.relative_to(ROOT)),'missing':True}); continue
 im=Image.open(p).convert('RGBA'); alpha=im.getchannel('A')
 diff=ImageChops.difference(base,im)
 # Diff visible colors on neutral background to disregard hidden RGB under transparency.
 def comp(x):
  b=Image.new('RGBA',x.size,'#888888'); b.alpha_composite(x); return b.convert('RGB')
 visible=ImageChops.difference(comp(base),comp(im))
 threshold=visible.convert('L').point(lambda v:255 if v>20 else 0)
 whole=threshold.histogram()[255]
 shoulder=threshold.crop((0,680,1024,1024)); shcount=shoulder.histogram()[255]
 roi=(300,240,700,410) if name.startswith('blink') else (360,410,640,550)
 within=threshold.crop(roi).histogram()[255]
 results.append({'file':str(p.relative_to(ROOT)),'size':list(im.size),'has_alpha':im.mode=='RGBA','alpha_range':list(alpha.getextrema()),'bbox':list(alpha.getbbox()),'visible_diff_bbox_threshold20':threshold.getbbox(),'changed_pixels_threshold20':whole,'shoulder_changed_pixels_threshold20':shcount,'shoulder_changed_fraction_threshold20':round(shcount/(1024*344),5),'local_region':roi if name.startswith(('blink','talk')) else None,'local_change_fraction':round(within/whole,5) if whole and name.startswith(('blink','talk')) else None})
 b=Image.new('RGBA',im.size,'#e8e8e8'); b.alpha_composite(im)
 x=(idx%6)*256;y=(idx//6)*282
 board.paste(b.resize((256,256)),(x,y));d.text((x+8,y+260),name,fill='black')
board.save(ROOT/'source/batch6/contact-xiaotong-bust.png')
(OUT/'verification-bust.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print(json.dumps(results,ensure_ascii=False,indent=2))
