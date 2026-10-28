from pathlib import Path
from PIL import Image,ImageOps,ImageDraw,ImageFont
import hashlib,json
base=Path(__file__).resolve().parents[1];p=base/'options'
xt=['xiaotong-10-clay-a','xiaotong-11-clay-b','xiaotong-12-pvc-a','xiaotong-13-pvc-b','xiaotong-14-street','xiaotong-15-toon3d'];dogs=['rourou-7-clay','rourou-8-pvc']
f=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',23)
def tile(c,n,x,y,w=600,h=440):
 im=Image.open(p/(n+'.png'));assert im.size==(1536,1024),(n,im.size)
 t=ImageOps.contain(im,(w-20,h-50));c.paste(t,(x+(w-t.width)//2,y+10));ImageDraw.Draw(c).text((x+20,y+h-32),n,font=f,fill='#234560')
c=Image.new('RGB',(3600,900),'#eaf0f4')
for i,n in enumerate(xt):tile(c,n,i*600,0)
for i,n in enumerate(dogs):tile(c,n,1200+i*600,450)
c.save(p/'overview-3.png')
c=Image.new('RGB',(1800,1320),'#eaf0f4');d=ImageDraw.Draw(c)
for i,(girl,dog) in enumerate([(xt[0],dogs[0]),(xt[2],dogs[1])]):
 x=i*900;d.text((x+20,20),girl+' + '+dog,font=f,fill='#234560')
 for n,y in [(girl,70),(dog,700)]:
  t=ImageOps.contain(Image.open(p/(n+'.png')),(880,590));c.paste(t,(x+10+(880-t.width)//2,y))
c.save(p/'pairs-3.png')
records=[]
for n in xt+dogs+['overview-3','pairs-3']:
 q=p/(n+'.png');im=Image.open(q);records.append({'file':'options/'+q.name,'size':list(im.size),'mode':im.mode,'bytes':q.stat().st_size,'sha256':hashlib.sha256(q.read_bytes()).hexdigest()})
(base/'round3/verification.json').write_text(json.dumps({'stage':'round3 style candidates only','files':records,'approval':'pending user choice'},ensure_ascii=False,indent=2)+'\n')
