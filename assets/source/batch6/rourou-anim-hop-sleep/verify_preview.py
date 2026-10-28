from PIL import Image,ImageDraw
from pathlib import Path
import json
root=Path(__file__).resolve().parents[3]
out=Path(__file__).resolve().parent
(root/'source'/'batch6'/'preview').mkdir(parents=True,exist_ok=True)
report={}
for group in ['hop','sleep']:
 frames=[]; records=[];paths=sorted((root/'pet'/'anim'/group).glob('*.png'))
 contact=Image.new('RGB',(256*4,284*((len(paths)+3)//4)),(225,230,236)); d=ImageDraw.Draw(contact)
 for i,p in enumerate(paths):
  im=Image.open(p).convert('RGBA');a=im.getchannel('A');b=a.point(lambda x:255 if x>8 else 0).getbbox()
  records.append({'file':str(p),'size':im.size,'has_alpha':True,'alpha_extrema':a.getextrema(),'bbox_alpha_gt8':b,'foot_y':b[3]-1,'bbox_height':b[3]-b[1],'bbox_width':b[2]-b[0]})
  bg=Image.new('RGB',im.size,(225,230,236));bg.paste(im,mask=a);frames.append(bg.resize((512,512),Image.Resampling.LANCZOS))
  contact.paste(bg.resize((256,256),Image.Resampling.LANCZOS),((i%4)*256,(i//4)*284));d.text(((i%4)*256+8,(i//4)*284+260),f'{group}/{p.name}',fill=(25,30,40))
 kwargs={'save_all':True,'append_images':frames[1:],'duration':100,'disposal':2}
 if group=='sleep':kwargs['loop']=0
 frames[0].save(root/'source'/'batch6'/'preview'/f'rourou-{group}.gif',**kwargs)
 contact.save(out/f'contact-{group}.png')
 report[group]={'frames':records,'target_foot_y':[870,870,850,850,850,860,870] if group=='hop' else [870]*4,'status':'generated_candidate_not_approved'}
(out/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps({g:[(v['file'].split('/')[-1],v['bbox_height'],v['foot_y']) for v in report[g]['frames']] for g in report}))
