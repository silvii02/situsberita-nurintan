<?
// namespace App\Http;

// use Illuminate\Foundation\Http\Kernel as HttpKernel;

// class Kernel extends HttpKernel
// {
    /**
     * The application's global HTTP middleware stack.
     *
     * These middleware are run during every request to your application.
     *
     * @var array
     */
    // protected $middleware = [
    //     \App\Http\Middleware\TrustProxies::class,
    //     \Illuminate\Http\Middleware\HandleCors::class, // Gunakan HandleCors yang terbaru
    //     \App\Http\Middleware\PreventRequestsDuringMaintenance::class,
    //     \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
    //     \App\Http\Middleware\TrimStrings::class,
    //     \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
    // ];

    /**
     * The application's route middleware groups.
     *
     * @var array
     */
    // protected $middlewareGroups = [
    //     'web' => [
    //         \App\Http\Middleware\EncryptCookies::class,
    //         \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
    //         \Illuminate\Session\Middleware\StartSession::class,
    //         // \Illuminate\Session\Middleware\AuthenticateSession::class, // Nonaktifkan jika tidak digunakan
    //         \Illuminate\View\Middleware\ShareErrorsFromSession::class,
    //         \App\Http\Middleware\VerifyCsrfToken::class,
    //         \Illuminate\Routing\Middleware\SubstituteBindings::class,
    //     ],

    //     'api' => [
    //         \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    //         'throttle:api',
    //         \Illuminate\Routing\Middleware\SubstituteBindings::class,
    //     ],
    // ];

    /**
     * The application's route middleware.
     *
     * These middleware may be assigned to groups or used individually.
     *
     * @var array
     */
//     protected $routeMiddleware = [
//         'auth' => \App\Http\Middleware\Authenticate::class,
//         'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
//         'bindings' => \Illuminate\Routing\Middleware\SubstituteBindings::class,
//         'cache.headers' => \Illuminate\Http\Middleware\SetCacheHeaders::class,
//         'can' => \Illuminate\Auth\Middleware\Authorize::class,
//         'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
//         'password.confirm' => \Illuminate\Auth\Middleware\RequirePassword::class,
//         'signed' => \Illuminate\Routing\Middleware\ValidateSignature::class,
//         'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
//         'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
//     ];
// }


namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     *
     * @var array
     */
    protected $middleware = [
        // Your global middleware here
        \App\Http\Middleware\TrustProxies::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
        \Illuminate\Foundation\Http\Middleware\TrimStrings::class,
        // \Illuminate\Http\Middleware\HandleCors::class,
        \App\Http\Middleware\SetCrossOriginHeaders::class,
         \App\Http\Middleware\CorsMiddleware::class,
    ];

    /**
     * The application's route middleware groups.
     *
     * @var array
     */
    protected $middlewareGroups = [
        'web' => [
            // Middleware for web routes
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\Session\Middleware\AuthenticateSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \App\Http\Middleware\VerifyCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
            // \Illuminate\Http\Middleware\HandleCors::class,
         \App\Http\Middleware\CorsMiddleware::class,
        ],

        'api' => [
            // Middleware for API routes
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
            // \Illuminate\Http\Middleware\HandleCors::class,
            \App\Http\Middleware\CorsMiddleware::class,
        ],
        
    ];

    /**
     * The application's route middleware.
     *
     * @var array
     */
    protected $routeMiddleware = [
        // Your route middleware here
        'auth' => \App\Http\Middleware\Authenticate::class,
        'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
        'bindings' => \Illuminate\Routing\Middleware\SubstituteBindings::class,
        'can' => \Illuminate\Auth\Middleware\Authorize::class,
        'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
        'password.confirm' => \Illuminate\Auth\Middleware\RequirePassword::class,
        'signed' => \Illuminate\Routing\Middleware\ValidateSignature::class,
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        'image.access' => \App\Http\Middleware\ImageAccess::class,
    ];
}
