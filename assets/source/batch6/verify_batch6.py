#!/usr/bin/env python3
"""Read-only asset checks; writes review artifacts only beneath source/batch6.

Run: python3 assets/source/batch6/verify_batch6.py
Bounding boxes are [left, top, right-exclusive, bottom-exclusive]; foot_y is
the last occupied row at alpha >= 16, a proxy requiring visual confirmation.
This script never changes source images or claims visual approval.
"""
from pathlib import Path
import hashlib
import json
import math
from datetime import datetime, timezone
from PIL import Image, ImageChops, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / 'assets/source/batch6'
POSES = 'idle hello happy think read reply write card listen mic heart cake gift shh sleep hug-rourou'.split()
BUSTS = 'gaze-c gaze-l gaze-r gaze-u gaze-d gaze-ul gaze-ur gaze-dl gaze-dr blink-1 blink-2 talk-1 talk-2 talk-3 hello happy think card'.split()
PETS = 'idle wave think sleep cheer card listen mic heart lick'.split()
XA = dict(idle=8, wave=8, happy=8, think=6, nod=6, **{'give-card':10}, heart=8, talk=6, sign=8)
PA = dict(idle=6, wag=6, lick=6, hop=8, sleep=4)


def digest(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()


def expected():
    result = {'assets/xiaotong/sheet.png': (2048,1024), 'assets/xiaotong/full.png': (1024,1024), 'assets/xiaotong/avatar-256.png': (256,256), 'assets/pet/sheet.png': (2048,1024)}
    for group, names in [('xiaotong/pose',POSES), ('xiaotong/bust',BUSTS), ('pet',PETS)]:
        for n in names:
            result[f'assets/{group}/{n}.png'] = (1024,1024)
            if group == 'pet':
                result[f'assets/pet/{n}-256.png'] = (256,256)
    for char, actions in [('xiaotong',XA),('pet',PA)]:
        for action, count in actions.items():
            for i in range(1,count+1):
                result[f'assets/{char}/anim/{action}/{i:02}.png']=(1024,1024)
    return result


def inspect(rel, size):
    path=ROOT/rel
    if not path.is_file():
        return dict(path=rel, status='missing', expected_size=size)
    try:
        with Image.open(path) as src:
            rgba=src.convert('RGBA'); alpha=rgba.getchannel('A')
            real_alpha='A' in src.getbands() or 'transparency' in src.info
            boxes={str(t):alpha.point(lambda x:255 if x>=t else 0).getbbox() for t in [1,16,128]}
            box=boxes['16']; ext=alpha.getextrema()
            sheet=path.name=='sheet.png'
            errors=[]
            if src.size!=size: errors.append('wrong_dimensions')
            if not sheet and (not real_alpha or ext[0]==255): errors.append('not_transparent')
            if not sheet and box is None: errors.append('empty_alpha')
            backup=ROOT/'assets/source/backup-batch6/pet'/path.name
            unchanged=rel.startswith('assets/pet/') and backup.is_file() and digest(path)==digest(backup)
            if unchanged: errors.append('unchanged_from_pre_batch6_backup')
            return dict(path=rel,status='issues' if errors else 'technical_pass',size=src.size,expected_size=size,mode=src.mode,has_alpha_channel=real_alpha,has_transparent_pixels=ext[0]<255,alpha_extrema=ext,bbox=box,bbox_by_threshold=boxes,foot_y=box[3]-1 if box and not sheet else None,sha256=digest(path),issues=errors,visual_approval='not_assessed')
    except Exception as exc:
        return dict(path=rel,status='unreadable',error=str(exc))


def checker(size):
    im=Image.new('RGB',size,'#f7f7f7'); d=ImageDraw.Draw(im)
    for y in range(0,size[1],16):
        for x in range(0,size[0],16):
            if (x//16+y//16)%2: d.rectangle((x,y,x+15,y+15),fill='#e4e4e4')
    return im


def contact(name, folder, names):
    cell=(240,270); cols=4
    canvas=Image.new('RGB',(cols*cell[0],math.ceil(len(names)/cols)*cell[1]),'white')
    draw=ImageDraw.Draw(canvas)
    for i,n in enumerate(names):
        x=(i%cols)*cell[0]; y=(i//cols)*cell[1]
        tile=checker((224,238)); path=ROOT/f'assets/{folder}/{n}.png'
        if path.is_file():
            try:
                with Image.open(path) as src:
                    image=src.convert('RGBA'); image.thumbnail((220,234))
                    tile.paste(image,((224-image.width)//2,(238-image.height)//2),image)
            except Exception:
                ImageDraw.Draw(tile).text((10,100),'UNREADABLE',fill='red')
        else:
            ImageDraw.Draw(tile).text((10,100),'MISSING',fill='red')
        canvas.paste(tile,(x+8,y+4)); draw.text((x+8,y+246),n+'.png',fill='black')
    canvas.save(OUT/name)


def diff_info(base, other):
    with Image.open(base) as a, Image.open(other) as b:
        if a.size!=b.size: return {'status':'size_mismatch'}
        a=a.convert('RGBA'); b=b.convert('RGBA')
        # Composite against neutral background to avoid irrelevant hidden RGB.
        aa=Image.new('RGBA',a.size,(128,128,128,255)); aa.alpha_composite(a)
        bb=Image.new('RGBA',b.size,(128,128,128,255)); bb.alpha_composite(b)
        diff=ImageChops.difference(aa.convert('RGB'),bb.convert('RGB'))
        channels=diff.split(); maxdiff=ImageChops.lighter(ImageChops.lighter(channels[0],channels[1]),channels[2])
        mask=maxdiff.point(lambda v:255 if v>20 else 0)
        count=mask.histogram()[255]; h=a.height
        lower=mask.crop((0,int(h*.60),a.width,h)).histogram()[255]
        return dict(threshold=20,changed_bbox=mask.getbbox(),changed_pixels=count,changed_fraction=count/(a.width*a.height),lower_40_percent_changed_pixels=lower,note='Diagnostic only: assess eyes/mouth localization visually; lower region is a shoulder/body proxy.')


def main():
    OUT.mkdir(parents=True,exist_ok=True)
    specs=expected(); rows=[inspect(rel,size) for rel,size in specs.items()]; bypath={r['path']:r for r in rows}
    previews=[]; alignment=[]
    (OUT/'preview').mkdir(exist_ok=True)
    for char,actions in [('xiaotong',XA),('pet',PA)]:
        for action,count in actions.items():
            paths=[ROOT/f'assets/{char}/anim/{action}/{i:02}.png' for i in range(1,count+1)]
            present=[p for p in paths if p.is_file()]
            data=[bypath[str(p.relative_to(ROOT))] for p in present]
            feet=[r.get('foot_y') for r in data if r.get('foot_y') is not None]
            baseline=940 if char=='xiaotong' else 870
            targets={}
            if char=='xiaotong' and action=='happy': targets={'04.png':920,'05.png':920}
            if char=='pet' and action=='hop': targets={f'{i:02}.png':y for i,y in enumerate([870,870,850,850,850,860,870],1)}
            deviations=[dict(path=r['path'],foot_y=r['foot_y'],expected_foot_y=targets.get(Path(r['path']).name,baseline),delta=r['foot_y']-targets.get(Path(r['path']).name,baseline)) for r in data if r.get('foot_y') is not None and abs(r['foot_y']-targets.get(Path(r['path']).name,baseline))>4]
            sizes=[(r['bbox'][2]-r['bbox'][0],r['bbox'][3]-r['bbox'][1]) for r in data if r.get('bbox')]
            hashes=[r.get('sha256') for r in data if r.get('sha256')]
            abrupt=[]
            valid=[r for r in data if r.get('bbox')]
            for prev,cur in zip(valid,valid[1:]):
                ps=(prev['bbox'][2]-prev['bbox'][0],prev['bbox'][3]-prev['bbox'][1]); cs=(cur['bbox'][2]-cur['bbox'][0],cur['bbox'][3]-cur['bbox'][1])
                ratios=[max(a,b)/max(1,min(a,b)) for a,b in zip(ps,cs)]
                if max(ratios)>1.20: abrupt.append(dict(previous=prev['path'],current=cur['path'],width_ratio=ratios[0],height_ratio=ratios[1]))
            alignment.append(dict(character=char,action=action,expected_frames=count,present_frames=len(present),baseline_foot_y=baseline,intentional_foot_targets=targets,deviations_over_4px=deviations,bbox_sizes=sizes,adjacent_bbox_changes_over_20_percent=abrupt,duplicate_file_count=len(hashes)-len(set(hashes)),note='Foot is alpha silhouette proxy; happy/hop airborne frames intentionally leave ground. Width changes may follow intended gestures. No automatic edits performed.'))
            if len(present)>=2:
                frames=[]
                for p in present:
                    with Image.open(p) as src:
                        im=src.convert('RGBA'); im.thumbnail((512,512))
                        background=checker(im.size); background.paste(im,(0,0),im)
                        frames.append(background)
                target=OUT/'preview'/f'{char}-{action}.gif'
                kwargs=dict(save_all=True,append_images=frames[1:],duration=100,disposal=2)
                if action in ({'idle','think','talk','sign'} if char=='xiaotong' else {'idle','wag','sleep'}): kwargs['loop']=0
                frames[0].save(target,**kwargs)
                previews.append(dict(path=str(target.relative_to(ROOT)),frames=len(frames),expected_frames=count,complete=len(frames)==count,fps=10))
    diffs={}; base=ROOT/'assets/xiaotong/bust/gaze-c.png'
    if base.is_file():
        for n in BUSTS:
            other=base.parent/(n+'.png')
            if other.is_file() and other!=base: diffs[n]=diff_info(base,other)
        gazes=[base.parent/(n+'.png') for n in BUSTS if n.startswith('gaze-') and (base.parent/(n+'.png')).is_file()]
        if gazes:
            with Image.open(gazes[0]) as src: overlay=src.convert('RGBA')
            for i,p in enumerate(gazes[1:],2):
                with Image.open(p) as src:
                    if src.size==overlay.size: overlay=Image.blend(overlay,src.convert('RGBA'),1/i)
            overlay.save(OUT/'gaze-overlay.png')
    contact('contact-xiaotong-poses.png','xiaotong/pose',POSES)
    contact('contact-xiaotong-bust.png','xiaotong/bust',BUSTS)
    contact('contact-rourou.png','pet',PETS)
    pose_alignment=[dict(path=r['path'],foot_y=r['foot_y'],delta=r['foot_y']-940) for r in rows if r['path'].startswith('assets/xiaotong/pose/') and r.get('foot_y') is not None and abs(r['foot_y']-940)>4]
    report=dict(generated_at=datetime.now(timezone.utc).isoformat(),scope='batch6 expected deliverables',expected_count=len(rows),present_count=sum(r['status']!='missing' for r in rows),missing=[r['path'] for r in rows if r['status']=='missing'],issues=[r for r in rows if r['status'] in ('issues','unreadable')],files=rows,pose_alignment_deviations_over_4px=pose_alignment,animation_alignment=alignment,bust_differences=diffs,previews=previews,visual_approval='not_assessed',limitations=['Alpha silhouette bottom is not anatomical foot detection.','Matching dimensions, alpha, and bounding boxes do not verify identity, clothing, clean edges, or temporal continuity.','Existing pet files identical to backup are flagged as old assets.'])
    report['intentional_omissions']={'assets/pet/anim/hop/08.png':'8 to 7 frames: rejected distorted/redundant candidates; see rourou-anim-hop-sleep/delivery-status.json'}
    report['unplanned_missing']=[p for p in report['missing'] if p not in report['intentional_omissions']]
    report['planned_deliverable_count']=len(rows)-len(report['intentional_omissions'])
    report['endpoint_reuse']={'xiaotong/idle':['01=08 loop endpoint','04=06 symmetric half blink'], 'xiaotong/wave':['01=08 common idle endpoint']}
    (OUT/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(dict(expected=len(rows),present=report['present_count'],missing=len(report['missing']),issues=len(report['issues']),previews=len(previews)),ensure_ascii=False))


if __name__=='__main__': main()
