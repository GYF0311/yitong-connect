from pathlib import Path
from PIL import Image,ImageDraw
import json,sys,hashlib
ROOT=Path(__file__).resolve().parents[3]
HERE=Path(__file__).resolve().parent
m=json.loads((HERE/'outputs.json').read_text())
records=[]
for key,p in m.items():
 group,num=key.split('-');im=Image.open(p).convert('RGBA'); im.save(HERE/f'{key}-native.png')
 a=im.getchannel('A');b=a.point(lambda x:255 if x>12 else 0).getbbox()
 crop=im.crop(b); height=850 if group=='talk' else 710
 width=round(crop.width*height/crop.height);crop=crop.resize((width,height),Image.Resampling.LANCZOS)
 out=Image.new('RGBA',(1024,1024));out.alpha_composite(crop,((1024-width)//2,941-height));dest=ROOT/f'xiaotong/anim/{group}/{num}.png';dest.parent.mkdir(parents=True,exist_ok=True);out.save(dest)
 bbox=out.getchannel('A').point(lambda x:255 if x>12 else 0).getbbox()
 records.append({'file':str(dest.relative_to(ROOT)),'native':p,'size':list(out.size),'alpha_extrema':out.getchannel('A').getextrema(),'bbox_alpha_gt12':bbox,'foot_y':bbox[3]-1,'transform':'uniform resize and translate only','sha256':hashlib.sha256(dest.read_bytes()).hexdigest()})
for group in ['talk','sign']:
 files=sorted((ROOT/f'xiaotong/anim/{group}').glob('*.png'))
 frames=[];contact=Image.new('RGB',(256*len(files),280),'#e5e8ed');d=ImageDraw.Draw(contact)
 for i,p in enumerate(files):
  im=Image.open(p).convert('RGBA');bg=Image.new('RGBA',im.size,'#e5e8ed');bg.alpha_composite(im);frames.append(bg.convert('RGB'));thumb=bg.resize((256,256));contact.paste(thumb.convert('RGB'),(i*256,0));d.text((i*256+10,261),p.name,fill='black')
 if frames:
  prev=ROOT/'source/batch6/preview';prev.mkdir(exist_ok=True);frames[0].save(prev/f'xiaotong-{group}.gif',save_all=True,append_images=frames[1:],duration=100,loop=0);contact.save(HERE/f'contact-{group}.png')
(HERE/'verification.json').write_text(json.dumps(records,ensure_ascii=False,indent=2))
print(json.dumps({'count':len(records),'foot_ys':sorted(set(x['foot_y'] for x in records))}))
