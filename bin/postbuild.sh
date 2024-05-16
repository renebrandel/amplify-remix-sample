rm -rf .amplify-hosting
mkdir -p ./.amplify-hosting/compute
cp -r ./build/server ./.amplify-hosting/compute/default
cp -r ./node_modules ./.amplify-hosting/compute/default/node_modules

cp -r ./build/client ./.amplify-hosting/static
cp deploy-manifest.json ./.amplify-hosting/deploy-manifest.json

ls ./.amplify-hosting
ls ./.amplify-hosting/compute/default
ls ./.amplify-hosting/static
ls ./.amplify-hosting/static/assets
cat ./.amplify-hosting/deploy-manifest.json