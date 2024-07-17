# start backend
Start-Process powershell -ArgumentList "-noexit", "-noprofile", "-command .\node_modules\.bin\ts-node-dev .\src\index.ts"
# start frontend
Start-Process powershell -ArgumentList "-noexit", "-noprofile", "-command cd .\frontend ; npm run dev"