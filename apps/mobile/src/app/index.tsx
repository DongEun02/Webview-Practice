import { StyleSheet, Alert } from 'react-native';
import WebView, { type WebViewMessageEvent } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { File, Paths } from 'expo-file-system';
import { Asset, requestPermissionsAsync } from 'expo-media-library';

// url: 웹에서 전달한 이미지의 전체 주소. 예: http://192.168.25.23:5173/src/assets/hero.png
async function saveImage(url: string) {
  // requestPermissionsAsync: 사진 권한을 요청
  // true는 쓰기 전용 요청을 의미한다. false는 사진 읽기 요청도 포함한다.
  const permission = await requestPermissionsAsync(true);

  // granted는 권한 허용 여부인 boolean이다. !는 반대이므로, 허용되지 않았을 때 실행한다.
  if (!permission.granted) {
    Alert.alert('저장 취소', '사진 저장 권한이 필요합니다.');
    return;
  }

  // Paths.cache는 이 앱의 캐시 폴더를 가리킨다. 운영체제가 정리할 수 있는 임시 보관 장소다.
  // new File은 저장할 위치를 가리키는 객체를 만든다. 이 줄에서 실제 파일이 생기지는 않는다.
  const destination = new File(Paths.cache, `web-image-${Date.now()}.png`);

  // 다운로드나 저장이 실패해도 finally에서 임시 파일 정리를 시도하도록 묶는다.
  try {
    // url의 이미지 데이터를 받아 destination 위치에 실제 파일로 저장한다.
    const downloaded = await File.downloadFileAsync(url, destination);

    // downloaded.uri는 웹 URL이 아니라 다운로드된 기기 파일의 주소(file:///...)다.
    // Asset.create는 이 파일을 사진 보관함에 저장하고, await는 저장 완료를 기다린다.
    await Asset.create(downloaded.uri);

    Alert.alert('저장 완료', '사진 앱에서 확인해주세요');
  } finally {
    // 다운로드 실패로 파일이 아예 없을 수도 있으므로, 존재하는지 먼저 확인한다.
    if (destination.exists) {
      // 캐시의 임시 파일만 삭제한다. 사진 보관함에 저장된 사진은 그대로 남는다.
      destination.delete();
    }
  }
}

export default function Index() {
  const handleMessage = async (e: WebViewMessageEvent) => {
    try {
      // postMessage()로 보낸 문자열은 event.nativeEvent.data로 받는다
      // WebView의 onMessage를 사용해서 이 브릿지를 사용할 수 있다
      const message = JSON.parse(e.nativeEvent.data);

      if (
        message.type === 'SAVE_IMAGE' &&
        typeof message.payload?.url === 'string'
      ) {
        await saveImage(message.payload.url);
      }
    } catch (error) {
      Alert.alert(
        '이미지 저장 실패',
        error instanceof Error ? error.message : '알 수 없는 오류입니다.',
      );
    }
  };

  return (
    // SafeAreaView는 기기에서 제공하는 안전 영역의 크기를 확인해 필요한 방향에 padding을 적용
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        style={styles.container}
        source={{ uri: 'http://192.168.25.23:5173/' }}
        onMessage={handleMessage}
      ></WebView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
