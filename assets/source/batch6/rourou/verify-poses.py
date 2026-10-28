from pathlib import Path
from PIL import Image, ImageDraw
import json

assets=Path(__file__).resolve().parents[3]
raw=Path(__file__).resolve().parent
names=['idle','wave','think','sleep','cheer','card','listen','mic','heart','lick']
records=[]
contact=Image.new('RGB',(1280,576),'#e9edf3')
draw=ImageDraw.Draw(contact)
for i,name in enumerate(names):
    source=raw/(name+'-raw.png')
    if not source.exists(): continue
    im=Image.open(source).convert('RGBA')
    alpha=im.getchannel('A')
    bbox=alpha.point(lambda a:255 if a>8 else 0).getbbox()
    cut=im.crop(bbox)
    ratio=min(700/cut.width,700/cut.height)
    cut=cut.resize((round(cut.width*ratio),round(cut.height*ratio)),Image.Resampling.LANCZOS)
    out=Image.new('RGBA',(1024,1024))
    out.alpha_composite(cut,((1024-cut.width)//2,870-cut.height))
    dst=assets/'pet'/(name+'.png')
    out.save(dst)
    thumb=out.resize((256,256),Image.Resampling.LANCZOS)
    thumb.save(assets/'pet'/(name+'-256.png'))
    x,y=(i%5)*256,(i//5)*288
    contact.paste(thumb,(x,y),thumb)
    draw.text((x+8,y+260),name+'.png',fill='#182334')
    for p in [dst,assets/'pet'/(name+'-256.png')]:
        a=Image.open(p).getchannel('A'); bb=a.point(lambda a:255 if a>8 else 0).getbbox()
        records.append({'file':str(p.relative_to(assets)),'size':list(Image.open(p).size),'has_alpha':True,'alpha_extrema':a.getextrema(),'bbox_alpha_gt_8':bb,'foot_y':bb[3]-1 if bb else None,'visual_status':'candidate_reviewed','approved':False})
contact.save(assets/'source/batch6/contact-rourou.png')
sheet=Image.open(assets/'pet/sheet.png')
records.insert(0,{'file':'pet/sheet.png','size':list(sheet.size),'has_alpha':'A' in sheet.getbands(),'bbox_alpha_gt_8':None,'foot_y':None,'visual_status':'candidate_reviewed','approved':False})
(raw/'verification-poses.json').write_text(json.dumps(records,ensure_ascii=False,indent=2))
print('poses',len(records)//2,'contact saved')
