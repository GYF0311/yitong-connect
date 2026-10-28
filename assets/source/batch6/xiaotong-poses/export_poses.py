from PIL import Image, ImageDraw
from pathlib import Path
import json
root=Path(__file__).resolve().parents[3]; src=Path(__file__).resolve().parent; out=root/'xiaotong'; (out/'pose').mkdir(parents=True,exist_ok=True)
paths=json.loads((src/'paths.json').read_text());report=[]
for name,path in paths.items():
 if name=='hug-rourou':continue
 im=Image.open(path).convert('RGBA'); a=im.getchannel('A');box=a.point(lambda x:255 if x>=32 else 0).getbbox(); im=im.crop(box)
 if name=='avatar_result':
  im.thumbnail((256,256),Image.Resampling.LANCZOS);canvas=Image.new('RGBA',(256,256));canvas.alpha_composite(im,((256-im.width)//2,(256-im.height)//2));dest=out/'avatar-256.png'
 else:
  target_h=650 if name in ['write','sleep','hug-rourou-v2'] else 850
  im=im.resize((round(im.width*target_h/im.height),target_h),Image.Resampling.LANCZOS);canvas=Image.new('RGBA',(1024,1024));canvas.alpha_composite(im,((1024-im.width)//2,941-target_h));dest=out/'full.png' if name=='full_result' else out/'pose'/((('hug-rourou' if name=='hug-rourou-v2' else name))+'.png')
 canvas.save(dest);bb=canvas.getchannel('A').getbbox();report.append({'file':str(dest.relative_to(root)),'native':path,'native_size':Image.open(path).size,'native_robust_bbox':box,'output_size':canvas.size,'bbox':bb,'foot_y':bb[3]-1,'alpha':True,'processing':'alpha>=32 robust subject crop; proportional Lanczos resize; transparent pad; standing850px/seated650px height; bottom y940'})
(src/'verification-poses.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
files=list((out/'pose').glob('*.png')); c=Image.new('RGB',(1000,4*300),'#e5e7eb');d=ImageDraw.Draw(c)
for i,f in enumerate(files):
 im=Image.open(f);im.thumbnail((240,270));x=i%4*250;y=i//4*300;c.paste(im,(x+(250-im.width)//2,y),im);d.text((x+10,y+275),f.name,fill='black')
c.save(src/'contact-final.jpg')
print('exported',len(report))
