# RDX AI Studio

request 

curl -X GET "https://anabot.my.id/api/ai/text2video?prompt=A%20vibrant%20surreal%20landscape%20featuring%20a%20classic%20red%20retro%20car%20parked%20on%20a%20colorful%20hillside%20covered%20with%20lush%20pink%20and%20red%20wildflowers.%20The%20sky%20is%20a%20dreamy%20mix%20of%20soft%20pastel%20blues%2C%20pinks%2C%20and%20oranges%2C%20filled%20with%20fluffy%2C%20scattered%20clouds.%20In%20the%20distance%2C%20sharp%20rocky%20cliffs%20rise%20dramatically%2C%20adding%20contrast%20to%20the%20smooth%20curves%20of%20the%20car.%20A%20distant%20planet%20or%20moon%20is%20visible%20in%20the%20bright%20sky%2C%20enhancing%20the%20otherworldly%20atmosphere.%20The%20scene%20is%20bathed%20in%20warm%2C%20golden%20sunlight%2C%20creating%20a%20magical%2C%20ethereal%20vibe.%20Highly%20detailed%2C%20cinematic%20lighting%2C%20dreamy%20and%20surreal%20aesthetic%20with%20vivid%20colors&apikey=freeApikey" \

  -H "accept: application/json"

response 

{

  "success": true,

  "data": {

    "result": "https://anabot.my.id/api/uploads/A_vibrant_surreal_landscape_fe_1789465001227.mp4"

  }

}


request 

curl -X GET "https://anabot.my.id/api/ai/text2image2?prompt=A%20vibrant%20surreal%20landscape%20featuring%20a%20classic%20red%20retro%20car%20parked%20on%20a%20colorful%20hillside%20covered%20with%20lush%20pink%20and%20red%20wildflowers.%20The%20sky%20is%20a%20dreamy%20mix%20of%20soft%20pastel%20blues%2C%20pinks%2C%20and%20oranges%2C%20filled%20with%20fluffy%2C%20scattered%20clouds.%20In%20the%20distance%2C%20sharp%20rocky%20cliffs%20rise%20dramatically%2C%20adding%20contrast%20to%20the%20smooth%20curves%20of%20the%20car.%20A%20distant%20planet%20or%20moon%20is%20visible%20in%20the%20bright%20sky%2C%20enhancing%20the%20otherworldly%20atmosphere.%20The%20scene%20is%20bathed%20in%20warm%2C%20golden%20sunlight%2C%20creating%20a%20magical%2C%20ethereal%20vibe.%20Highly%20detailed%2C%20cinematic%20lighting%2C%20dreamy%20and%20surreal%20aesthetic%20with%20vivid%20colors&models=photorealistic&apikey=freeApikey" \

  -H "accept: application/json"


response 

{

  "success": false,

  "error": "Internal Server Error"

}


aik achi si text to picture or video wali website bnao professional ho like google flow type 

aik perfect website bnao rdx ai studio name sa

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://rdx-dream-canvas.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d4b10453-dfd3-40ef-af4a-2c4ffb26f8e4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
