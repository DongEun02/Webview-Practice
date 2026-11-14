import hero from './assets/hero.png';

// TypeScript가 브릿지 객체를 알 수 있도록 타입 선언
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

export default function Gallery() {
  const handleSaveImage = () => {
    const bridge = window.ReactNativeWebView;

    if (!bridge) {
      alert('web 이미지 저장');
      return;
    }
    // postMessage로 이미지 URL 전달
    bridge.postMessage(
      // 브릿지는 문자열을 받으므로 객체를 문자열로 직렬화
      JSON.stringify({
        type: 'SAVE_IMAGE',
        payload: {
          // 이미지 경로를 RN에서 다운로드할 수 있는 전체 URL로 변경
          url: new URL(hero, window.location.href).href,
        },
      }),
    );
  };

  return (
    <div>
      <img src={hero} />
      <button onClick={handleSaveImage}>이미지 저장</button>
    </div>
  );
}
