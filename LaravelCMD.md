composer install
php artisan key:generate
php artisan migrate

php artisan make:migration [name]
php artisan make:model [task]
php artisan make:controller [NameController] --resource
php artisan make:controller Api/[NameController] --api
php artisan make:request [name]
