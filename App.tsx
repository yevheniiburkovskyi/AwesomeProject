import React, {useCallback, useEffect, useState} from 'react';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

const ALBUM_NAME = 'TestAlbum';

const App = () => {
  const [image, setImage] = useState(null);
  const [assetState, setAssetState] = useState<MediaLibrary.Asset | null>(null);

  const [_, requestPermission] = MediaLibrary.usePermissions();

  const saveImageToAlbum = useCallback(async (uri: string) => {
    const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);

    const asset = await MediaLibrary.createAssetAsync(uri);

    if (album) {
      await MediaLibrary.addAssetsToAlbumAsync(asset, album);
    } else {
      await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset);
    }

    setAssetState(asset);
  }, []);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      saveImageToAlbum(result.assets[0].uri);
    }
  }, [saveImageToAlbum]);

  const deleteImage = useCallback(async () => {
    if (assetState) {
      await MediaLibrary.deleteAssetsAsync(assetState);
    }
  }, [assetState]);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return (
    <View style={styles.container}>
      {assetState && <Text>{assetState.uri}</Text>}
      {image && <Image source={{uri: image}} style={styles.image} />}
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Button title="Delete image" onPress={deleteImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  image: {width: 200, height: 200},
});

export default App;
