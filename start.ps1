# start backend
Start-Process powershell -ArgumentList "-noexit", "-noprofile", "-command .\node_modules\.bin\ts-node .\dist\index.js"
# start frontend
Start-Process powershell -ArgumentList "-noexit", "-noprofile", "-command cd .\frontend ; npm run preview"