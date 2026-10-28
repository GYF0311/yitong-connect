from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib
root=Path(__file__).resolve().parents[3]
records=[]
for name,wanted in [('give-card',10),('heart',8)]:
 fs=sorted((root/'xiaotong/anim'/name).glob('*.png')); previews=[]
 sheet=Image.new('RGB',(256*5,280*((len(fs)+4)//5)),'#ddd'); d=ImageDraw.Draw(sheet)
 for i,p in enumerate(fs):
  im=Image.open(p).convert('RGBA');a=im.getchannel('A');bb=a.point(lambda x:255 if x>12 else 0).getbbox();full=a.getbbox()
  records.append({'file':str(p.relative_to(root)),'size':im.size,'has_alpha':True,'alpha_extrema':a.getextrema(),'bbox_alpha12':bb,'bbox_alpha0':full,'foot_y':bb[3]-1,'head_y':bb[1],'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
  small=im.copy();small.thumbnail((256,256));x=i%5*256;y=i//5*280;sheet.paste(small,(x,y),small);d.text((x+10,y+260),p.name,fill='black')
  bg=Image.new('RGBA',(512,512),'#eee');s=im.resize((512,512),Image.Resampling.LANCZOS);bg.alpha_composite(s);previews.append(bg.convert('RGB').quantize(colors=255))
 sheet.save(root/'source/batch6/anim-card-heart'/f'contact-{name}.png')
 if previews:
  out=root/'source/batch6/preview';out.mkdir(exist_ok=True);previews[0].save(out/f'xiaotong-{name}.gif',save_all=True,append_images=previews[1:],duration=100,loop=1,disposal=2)
summary={'files':records,'groups':{n:{'expected':w,'actual':len(list((root/'xiaotong/anim'/n).glob('*.png')))} for n,w in [('give-card',10),('heart',8)]},'verification_scope':'technical measurements plus human contact sheet visual review; not user-approved'}
(root/'source/batch6/anim-card-heart/verification.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2))
print([(x['file'],x['bbox_alpha12'],x['foot_y']) for x in records])
