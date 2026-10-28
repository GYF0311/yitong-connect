from PIL import Image
import sys,json
from pathlib import Path
p=Path(sys.argv[1]); out=Path(sys.argv[2])
im=Image.open(p).convert('RGBA'); a=im.getchannel('A'); bb=a.point(lambda v:255 if v>12 else 0).getbbox()
if a.getextrema()==(255,255): raise ValueError('no transparency')
# Explicit delivery normalization: preserve aspect ratio, scale full subject to nominal 850px height, ground at y940.
sub=im.crop(bb); ratio=850/sub.height; sub=sub.resize((round(sub.width*ratio),850),Image.Resampling.LANCZOS)
canvas=Image.new('RGBA',(1024,1024)); canvas.alpha_composite(sub,((1024-sub.width)//2,91)); canvas.save(out)
print(json.dumps({'source':str(p),'source_size':im.size,'source_bbox':bb,'scale':ratio,'output':str(out),'bbox':canvas.getchannel('A').getbbox()}))
