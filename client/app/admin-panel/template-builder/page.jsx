import EditorInner from './EditorInner'
import getConfig from 'next/config'

export default function page () {

  const { serverRuntimeConfig } = getConfig() || {};

  let accessToken = ''
  let apiBackendURL = ''
  let tenantID = 0
  let isLogin=0


  if (serverRuntimeConfig) {
    // get api backend url
    apiBackendURL = serverRuntimeConfig.API_BACKEND_SERVER
    // get access token
    accessToken = serverRuntimeConfig.API_ACCESS_TOKEN_SERVER
    tenantID = serverRuntimeConfig.TENANT_ID
    isLogin = serverRuntimeConfig.IS_LOGIN

  }




  return (
    <div>
      {/* <EditorInner tId={tenantID}  /> */}
    </div>
  )
}
