from PIL import Image
from pathlib import Path
import json
ROOT=Path('/Users/gaoyifan/Desktop/李依依提案/第三层-明星与连接/assets')
S=ROOT/'source/batch6/rourou-anim'
D=ROOT/'pet/anim/idle'
D.mkdir(parents=True,exist_ok=True)
records=[]
for src in sorted(S.glob('idle-*-native.png')):
    im=Image.open(src).convert('RGBA')
    a=im.getchannel('A'); transparent=a.getextrema()[0]<255
    if not transparent:
        records.append({'source':str(src),'status':'rejected_opaque'});continue
    im=im.resize((902,902),Image.Resampling.LANCZOS)
    canvas=Image.new('RGBA',(1024,1024));canvas.paste(im,(61,61));im=canvas
    bb=im.getchannel('A').point(lambda x:255 if x>12 else 0).getbbox()
    dx=-33;dy=870-(bb[3]-1)
    out=Image.new('RGBA',(1024,1024));out.paste(im,(dx,dy))
    name=src.name.split('-')[1]+'.png';out.save(D/name)
    bb2=out.getchannel('A').point(lambda x:255 if x>12 else 0).getbbox()
    records.append({'file':str(D/name),'source_size':Image.open(src).size,'size':out.size,'alpha':True,'bbox':bb2,'foot_y':bb2[3]-1,'translation':[dx,dy]})
(S/'verification-idle.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
ims=[]
for p in sorted(D.glob('*.png')):
    im=Image.open(p).convert('RGBA');bg=Image.new('RGBA',im.size,'#edf2f7');bg.alpha_composite(im);ims.append(bg.convert('RGB').resize((512,512)))
if len(ims)>1:
    (ROOT/'source/batch6/preview').mkdir(exist_ok=True)
    ims[0].save(ROOT/'source/batch6/preview/rourou-idle.gif',save_all=True,append_images=ims[1:],duration=100,loop=0,disposal=2)
print(json.dumps(records,indent=2))
