import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // https://vitejs.dev/config/
  return defineConfig({
    define: {
      'process.env': env,
    },
    base: `${env.VITE_APP_PATH}`,
    plugins: [react({
      babel: {
        plugins: [['module:@preact/signals-react-transform']],
      },
    }), basicSsl()],
  });
}