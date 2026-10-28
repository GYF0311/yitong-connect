from pathlib import Path
from PIL import Image
import json, sys, shutil

ROOT = Path(__file__).resolve().parents[3]
SRC = Path(__file__).resolve().parent
def export(src, action, frame, target_bottom=940):
    target_bottom = int(target_bottom)
    src = Path(src)
    native = SRC / f'{action}-{frame}-native.png'
    shutil.copy2(src, native)
    im = Image.open(src).convert('RGBA')
    im = im.resize((1024,1024), Image.Resampling.LANCZOS)
    a=im.getchannel('A')
    bbox=a.point(lambda p:255 if p>8 else 0).getbbox()
    if not bbox or a.getextrema()[0] == 255:
        raise RuntimeError('Missing real alpha')
    scale=850/(bbox[3]-bbox[1])
    body=im.crop(bbox); body=body.resize((round(body.width*scale),850),Image.Resampling.LANCZOS)
    im=Image.new('RGBA',(1024,1024),(0,0,0,0)); im.alpha_composite(body,((1024-body.width)//2,target_bottom-849))
    bbox=im.getchannel('A').point(lambda p:255 if p>8 else 0).getbbox()
    dy=target_bottom-(bbox[3]-1)
    if dy:
        aligned=Image.new('RGBA',im.size,(0,0,0,0)); aligned.alpha_composite(im,(0,dy)); im=aligned
    dest=ROOT/'xiaotong'/'anim'/action/f'{frame}.png'
    dest.parent.mkdir(parents=True,exist_ok=True); im.save(dest)
    bbox=im.getchannel('A').point(lambda p:255 if p>8 else 0).getbbox()
    record={'file':str(dest),'native':str(native),'size':im.size,'alpha_extrema':im.getchannel('A').getextrema(),'bbox_alpha_gt8':bbox,'foot_y':bbox[3]-1,'translation_y':dy}
    with (SRC/'exports.jsonl').open('a') as f:f.write(json.dumps(record,ensure_ascii=False)+'\n')
    print(json.dumps(record,ensure_ascii=False))
if __name__=='__main__':export(*sys.argv[1:])
