from PIL import Image
from pathlib import Path
import shutil,sys,json
root=Path('/Users/gaoyifan/Desktop/李依依提案/第三层-明星与连接/assets')
group,num,source=sys.argv[1:]
src=Path(source); dst=root/f'pet/anim/{group}/{num}.png'; native=root/f'source/batch6/rourou-anim-wag-lick/{group}-{num}-native.png'; shutil.copy2(src,native)
im=Image.open(src).convert('RGBA'); a=im.getchannel('A'); bb=a.point(lambda x:255 if x>16 else 0).getbbox(); s=715/(bb[3]-bb[1]); im=im.resize((round(im.width*s),round(im.height*s)),Image.Resampling.LANCZOS); bb=im.getchannel('A').point(lambda x:255 if x>16 else 0).getbbox(); out=Image.new('RGBA',(1024,1024)); out.alpha_composite(im,(round(512-(bb[0]+bb[2])/2),870-bb[3])); out.save(dst); print(dst, out.getchannel('A').point(lambda x:255 if x>16 else 0).getbbox())
