rm -rf .amplify-hosting
mkdir -p ./.amplify-hosting/compute
cp -r ./build/server ./.amplify-hosting/compute/default
cp -r ./node_modules ./.amplify-hosting/compute/default/node_modules
cp -r ./build/client ./.amplify-hosting/static

cp ./amplify-plugin/deploy-manifest.json ./.amplify-hosting/deploy-manifest.json
cp ./amplify-plugin/server.js ./.amplify-hosting/compute/default/server.js
cp ./amplify-plugin/package.json ./.amplify-hosting/compute/default/package.json

echo "======./amplify-hosting===="
ls ./.amplify-hosting
echo
echo "======./amplify-hosting/compute/default===="
ls ./.amplify-hosting/compute/default
echo
echo "======./amplify-hosting/static===="
ls ./.amplify-hosting/static
echo
echo "======./amplify-hosting/static/assets===="
ls ./.amplify-hosting/static/assets
echo
echo "======deploy-manifest.json===="
cat ./.amplify-hosting/deploy-manifest.json