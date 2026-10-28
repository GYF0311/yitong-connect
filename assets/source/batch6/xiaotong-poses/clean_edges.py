from PIL import Image,ImageFilter
from pathlib import Path
import json
root=Path(__file__).resolve().parents[3];files=[root/'xiaotong/full.png',root/'xiaotong/avatar-256.png',*sorted((root/'xiaotong/pose').glob('*.png'))]; report=[]
for f in files:
 im=Image.open(f).convert('RGBA'); pix=im.load(); alpha=im.getchannel('A'); edge=alpha.filter(ImageFilter.MinFilter(9)).load(); edits=[]
 for y in range(im.height):
  for x in range(im.width):
   r,g,b,a=pix[x,y]
   bad=(r>170 and r>g*1.5 and r>b*1.4) or (r>180 and g>120 and b<85 and r>g*1.25)
   if a and bad and edge[x,y]<20:
    # Isolated saturated red/yellow pixels generated outside the cutout are not hair.
    edits.append((x,y))
 for x,y in edits:pix[x,y]=(0,0,0,0)
 im.save(f);report.append({'file':str(f.relative_to(root)),'saturated_edge_pixels_removed':len(edits)})
(Path(__file__).parent/'edge-cleaning.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(report)
