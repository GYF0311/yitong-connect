import json,subprocess,sys,os
from pathlib import Path
base=Path('assets/source/batch5/feishu-archive')
doc=json.loads((base/'create-result.json').read_text())['data']['document']['document_id']
queue=Path(sys.argv[1]);items=json.loads(queue.read_text());journal=base/(queue.stem+'-journal.jsonl')
done={r['index'] for l in journal.read_text().splitlines() if (r:=json.loads(l)).get('ok')} if journal.exists() else set()
env=os.environ.copy();env.update(LARKSUITE_CLI_NO_UPDATE_NOTIFIER='1',LARKSUITE_CLI_NO_SKILLS_NOTIFIER='1')
for i,item in enumerate(items):
 if i in done:continue
 if item['kind']=='text':argv=['lark-cli','docs','+update','--as','user','--doc',doc,'--command','append','--content',item['content']]
 else:
  argv=['lark-cli','docs','+media-insert','--as','user','--doc',doc,'--file',item['file'],'--type',('image' if item['kind']=='image' else 'file')]
  if item['kind']=='image':argv+=['--caption',item['caption'],'--width','1000']
 r=subprocess.run(argv,capture_output=True,text=True,env=env)
 try:out=json.loads(r.stdout)
 except Exception:out={'stdout':r.stdout,'stderr':r.stderr}
 ok=r.returncode==0 and out.get('ok',False)
 with journal.open('a') as f:f.write(json.dumps({'index':i,'ok':ok,'item':item,'result':out},ensure_ascii=False)+'\n')
 print(f'{i+1}/{len(items)} '+('OK ' if ok else 'FAILED ')+item.get('file',item['kind']),flush=True)
 if not ok:print(json.dumps(out,ensure_ascii=False),flush=True);sys.exit(1)
