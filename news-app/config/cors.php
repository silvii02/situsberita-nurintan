<?php

return [
    'paths' => ['/*'],
    'allowed_methods' => ['*'],
'allowed_origins' => [
    'http://localhost:3000',  // Allow local development
    'https://www.situsintan.org',  // Allow production domain
    'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?client_id=1063218490939-j8eil2n0fa30d22clleboevpmcaugrg8.apps.googleusercontent.com&scope=openid%20email%20profile&response_type=id_token&gsiwebsdk=gis_attributes&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_mode=form_post&origin=http%3A%2F%2Flocalhost%3A3000&display=popup&prompt=select_account&gis_params=ChVodHRwOi8vbG9jYWxob3N0OjMwMDASFWh0dHA6Ly9sb2NhbGhvc3Q6MzAwMBgHKhZIVGk4QVpTaGlKd0tPZ1RPakllZWJnMkkxMDYzMjE4NDkwOTM5LWo4ZWlsMm4wZmEzMGQyMmNsbGVib2V2cG1jYXVncmc4LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tOAFCQGI3MWJiNTA0NmY3ZTZiMjY3ZTliZjE2OGYyYmM4ZmZjYmFlZmFhNjIyN2RjOTBkMjIwMTUzOTM4MWE0YTk1ODY&service=lso&o2v=1&ddm=1&flowName=GeneralOAuthFlow'
],
    'allowed_origins_patterns' => [],
    // 'allowed_headers' => ['*'],
    'allowed_headers' => ['Content-Type', 'X-Requested-With', 'Authorization'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];