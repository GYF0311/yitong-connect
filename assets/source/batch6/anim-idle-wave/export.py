from PIL import Image,ImageDraw
from pathlib import Path
import json,shutil
ROOT=Path(__file__).resolve().parents[3]
SRC=Path(__file__).parent
# Export only: preserve generated artwork; resize uniformly to the agreed standing
# character height, then translate to foot y=940. No synthetic motion is added.
def export(src,group,n):
 im=Image.open(src).convert('RGBA'); raw=SRC/f'{group}-{n}-native.png'; shutil.copyfile(src,raw)
 a=im.getchannel('A'); bbox=a.point(lambda v:255 if v>16 else 0).getbbox()
 if bbox is None: raise ValueError('empty alpha')
 c=im.crop(bbox); h=851; w=round(c.width*h/c.height); c=c.resize((w,h),Image.Resampling.LANCZOS)
 out=Image.new('RGBA',(1024,1024));out.alpha_composite(c,((1024-w)//2,90))
 target=ROOT/'xiaotong'/'anim'/group/f'{n}.png';target.parent.mkdir(parents=True,exist_ok=True);out.save(target)
 return {'file':str(target.relative_to(ROOT)), 'native_size':im.size,'native_bbox_alpha_gt16':bbox,'size':out.size,'has_alpha':True,'alpha_extrema':out.getchannel('A').getextrema(),'bbox':out.getchannel('A').getbbox(),'foot_y':out.getchannel('A').getbbox()[3]-1,'note':'Uniform scale to 851px standing subject, centered, foot y940. Native retained.'}
if __name__=='__main__':
 mapping=json.loads((SRC/'sources.json').read_text()); records=[export(v,*k.split('/')) for k,v in mapping.items()]
 (SRC/'verification.json').write_text(json.dumps(records,ensure_ascii=False,indent=2))
 preview=ROOT/'source/batch6/preview';preview.mkdir(exist_ok=True)
 for g in ('idle','wave'):
  paths=sorted((ROOT/'xiaotong/anim'/g).glob('*.png'));frames=[]
  for p in paths:
   im=Image.open(p).convert('RGBA');bg=Image.new('RGBA',im.size,(240,243,248,255));bg.alpha_composite(im);frames.append(bg.convert('RGB'))
  if frames:frames[0].save(preview/f'xiaotong-{g}.gif',save_all=True,append_images=frames[1:],duration=100,loop=0 if g=='idle' else 1)
 print(json.dumps({'count':len(records),'feet':sorted(set(x['foot_y'] for x in records))}))
