from pathlib import Path
from PIL import Image
import json,shutil
assets=Path('/Users/gaoyifan/Desktop/李依依提案/第三层-明星与连接/assets'); record=[]
for i,nose in enumerate([612.7,579.1,425.5,359.2,522.8,582.1],1):
 p=assets/f'pet/anim/wag/{i:02}.png'; im=Image.open(p).convert('RGBA'); shutil.copy2(p,assets/f'source/batch6/rourou-anim-wag-lick/wag-{i:02}-before-anchor.png'); s=680/715; im=im.resize((round(1024*s),round(1024*s)),Image.Resampling.LANCZOS); bb=im.getchannel('A').point(lambda x:255 if x>16 else 0).getbbox(); dx=round(460-nose*s);dy=870-bb[3];out=Image.new('RGBA',(1024,1024));out.alpha_composite(im,(dx,dy));out.save(p);final=out.getchannel('A').point(lambda x:255 if x>16 else 0).getbbox(); record.append({'file':str(p.relative_to(assets)),'scale':s,'nose_x_anchor':460,'translate':[dx,dy],'bbox_alpha_gt16':final,'foot_y':final[3]});print(record[-1])
(assets/'source/batch6/rourou-anim-wag-lick/wag-alignment.json').write_text(json.dumps(record,indent=2))
