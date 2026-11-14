import { StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

export default function Index() {
  return (
    <WebView
      style={styles.container}
      source={{ uri: 'http://192.168.25.23:5173/' }}
    ></WebView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
