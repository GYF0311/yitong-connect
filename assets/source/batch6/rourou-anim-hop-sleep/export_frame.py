from PIL import Image
from pathlib import Path
import sys,json,shutil
base=Path(__file__).resolve().parent
assets=base.parents[2]
src=Path(sys.argv[1]); group=sys.argv[2]; num=int(sys.argv[3]); target_y=int(sys.argv[4]) if len(sys.argv)>4 else 870
native=base/f'{group}-{num:02d}-native.png';shutil.copy2(src,native)
im=Image.open(src).convert('RGBA')
if im.size!=(1024,1024): im=im.resize((1024,1024),Image.Resampling.LANCZOS)
a=im.getchannel('A'); b=a.point(lambda x:255 if x>8 else 0).getbbox()
if not b or a.getextrema()[0]==255: raise ValueError('No meaningful transparency')
if num==1:
 scale=(660 if group=='hop' else 330)/(b[3]-b[1]); crop=im.crop(b);crop=crop.resize((round(crop.width*scale),round(crop.height*scale)),Image.Resampling.LANCZOS);im=Image.new('RGBA',(1024,1024));im.alpha_composite(crop,((1024-crop.width)//2,target_y-crop.height+1));b=im.getchannel('A').point(lambda x:255 if x>8 else 0).getbbox()
dy=target_y-(b[3]-1)
if abs(dy)>4:
 out=Image.new('RGBA',(1024,1024));out.alpha_composite(im,(0,dy));im=out
outpath=assets/'pet'/'anim'/group/f'{num:02d}.png';outpath.parent.mkdir(parents=True,exist_ok=True);im.save(outpath)
b=im.getchannel('A').point(lambda x:255 if x>8 else 0).getbbox()
rec={'group':group,'frame':num,'source':str(src),'output':str(outpath),'bbox_alpha_gt8':b,'foot_y':b[3]-1,'translation_y':dy if abs(dy)>4 else 0,'size':im.size,'alpha_extrema':im.getchannel('A').getextrema()}
with (base/'exports.jsonl').open('a') as f:f.write(json.dumps(rec)+'\n')
print(json.dumps(rec))
