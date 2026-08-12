<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>{{ $code ? 'Your verification code' : 'Welcome' }}</title>
</head>
<body>
    @if ($code)
        <p>Hi {{ $name }},</p>
        <p>Your verification code is: <strong>{{ $code }}</strong></p>
        <p>This code expires in 10 minutes.</p>
    @else
        <p>Hi {{ $name }},</p>
        <p>Welcome to our platform! We're glad to have you.</p>
        <p>Your registered email is: {{ $email }}</p>
    @endif
</body>
</html>
