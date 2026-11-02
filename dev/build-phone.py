"""Make the phone (claude.ai artifact) copy of the app.
Usage: python3 dev/build-phone.py   (run from the groundwork folder)
Output: dev/groundwork-phone.html  -> publish it to the Groundwork artifact.
Strips html/head/body wrappers (the artifact host adds them) and the
"Download file" backup button (downloads are blocked in artifacts)."""
import pathlib
root = pathlib.Path(__file__).resolve().parent.parent
s = (root / 'app' / 'index.html').read_text(encoding='utf-8')
for a in ['<!doctype html>\n', '<html lang="en">\n', '<head>\n', '<meta charset="utf-8">\n',
          '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n',
          '</head>\n', '<body>\n', '</body>\n', '</html>\n',
          '<button class="btn" id="bkFile">Download file</button>']:
    assert s.count(a) == 1, f'not found once: {a!r}'
    s = s.replace(a, '', 1)
s = s.replace("  $('#bkFile').onclick=downloadBackup;};", "};")
(root / 'dev' / 'groundwork-phone.html').write_text(s, encoding='utf-8')
print('wrote dev/groundwork-phone.html')
