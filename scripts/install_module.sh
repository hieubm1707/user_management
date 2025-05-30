read -p "nEnter your module path: " path

if [ "$path" == "" ]; then
    echo "Path is required"
    exit
fi

# Check if the folder path exists
if [ ! -d "$path" ]; then
    echo "Module path does not exist"
    exit
fi
controllerPath="$path/controllers"
modelPath="$path/models"

# Check if the controllers folder does not exist or is empty 
# Check if the models folder does not exist or is empty
# return error and exit
if [ ! -d "$controllerPath" ] || [ ! "$(ls -A $controllerPath)" ]; then
    echo "Module path invalid"
    exit
fi

if [ ! -d "$modelPath" ] || [ ! "$(ls -A $modelPath)" ]; then
    echo "Module path invalid"
    exit
fi

# get the module name from the path
moduleName=$(basename $path)
pascalCaseModuleName=$(echo "$moduleName" | awk 'BEGIN{FS="_"} {for (i=1; i<=NF; i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))} 1' OFS="")

# Create a temporary file for sed output 
echo "Module name: $moduleName"
tmpFile="/tmp/tempfile_$$"

# replace controller in /src/controllers/index.ts with text "// add new controller here" 
# by moduleName. Example: import { ${moduleName}Controller } from '../features/moduleName'; 
controllers=$(grep -o "default as [^ ]*" "$path/controllers/index.ts" | awk '{print $3}' | paste -sd',' -)

sed "s|// add new controller here|import { $controllers } from '../features/$moduleName';\n// add new controller here|g" src/controllers/index.ts > "$tmpFile" 
mv "$tmpFile" src/controllers/index.ts 

# replace router in /src/controllers/index.ts with text "// add new route here" 
# by moduleName. Example: router.use('/${moduleName}', ${moduleName}Controller);
echo "$controllers"
while IFS=, read -ra ADDR; do 
    for i in "${ADDR[@]}"; do
        route=$(echo "$i" | sed 's/Controller//g' | sed 's/\([A-Z]\)/-\1/g' | tr '[:upper:]' '[:lower:]')
        echo "route $route"
        sed "s|// add new route here|router.use('/$route', $i);\\n// add new route here|g" src/controllers/index.ts > "$tmpFile"
        mv "$tmpFile" src/controllers/index.ts
    done 
done <<< "$controllers"

# # append model in /src/models/index.ts by moduleName. 
# # Example: export { default as ${moduleName^}Model } from './$moduleName.model'; 
models=$(grep -o "default as [^ ]*" "$path/models/index.ts" | awk '{print $3}' | paste -sd',' -)
echo "export { $models } from '../features/$moduleName';" >> src/models/index.ts

resources=$(grep -o "default as [^ ]*" "$path/admin/resources/index.ts" | awk '{print $3}' | paste -sd',' -)
echo "export { $resources } from '../../features/$moduleName/admin';\n" >> src/admin/resources/index.ts

npm run lint:fix