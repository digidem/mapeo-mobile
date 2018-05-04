import * as ImageResizer from 'react-native-image-resizer';

export default (async function(sourceURI) {
  const resizedImage = await ImageResizer.default
    .createResizedImage(sourceURI, 200, 150, 'JPEG', 50)
    .catch(err => {
      console.warn(err);
    });
  const resizedURI = resizedImage.uri;

  return resizedURI;
});
