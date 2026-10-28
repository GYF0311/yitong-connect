from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont
import json,hashlib
base=Path(__file__).resolve().parent
p=base/'options'
xt=['xiaotong-5-pvc','xiaotong-6-clay-slim','xiaotong-7-street','xiaotong-8-toon3d','xiaotong-9-film']
dogs=['rourou-3-figure','rourou-4-clay','rourou-5-toon','rourou-6-line']
f=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',23)
def tile(canvas,name,x,y,w=600,h=440):
 im=Image.open(p/(name+'.png'));assert im.size==(1536,1024),(name,im.size)
 thumb=ImageOps.contain(im,(w-20,h-50));canvas.paste(thumb,(x+(w-thumb.width)//2,y+10))
 ImageDraw.Draw(canvas).text((x+20,y+h-32),name,font=f,fill='#234560')
c=Image.new('RGB',(3000,900),'#eaf0f4')
for i,n in enumerate(xt):tile(c,n,i*600,0)
for i,n in enumerate(dogs):tile(c,n,300+i*600,450)
c.save(p/'overview-2.png')
# Retain both complete source sheets for each pair; no cropping of portraits or limbs.
c=Image.new('RGB',(2700,1320),'#eaf0f4');d=ImageDraw.Draw(c)
for i,(girl,dog) in enumerate([(xt[0],dogs[0]),(xt[1],dogs[1]),(xt[3],dogs[2])]):
 x=i*900
 d.text((x+20,20),girl+' + '+dog,font=f,fill='#234560')
 for name,y in [(girl,70),(dog,700)]:
  im=Image.open(p/(name+'.png'))
  thumb=ImageOps.contain(im,(880,590));c.paste(thumb,(x+10+(880-thumb.width)//2,y))
c.save(p/'pairs-2.png')
records=[]
for n in xt+dogs+['overview-2','pairs-2']:
 path=p/(n+'.png');im=Image.open(path)
 records.append({'file':'options/'+path.name,'size':list(im.size),'mode':im.mode,'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
(base/'round2-verification.json').write_text(json.dumps({'stage':'round2 style candidates only','files':records,'pair_method':'complete girl and dog sheets fitted without cropping or warping; pairing is a collage, not a newly generated scene','reference_approval':'pending user choice'},ensure_ascii=False,indent=2)+'\n')
