# Fast run
cp .example.env .env

npm install

npm install prisma --save-dev

npx prisma migrate dev

npm run dev

# API

## <br>
<details><summary>Пуш уведомления</summary>

## Одному пользователю

<details>
<summary>Запрос</summary>
Пользователь должен быть администратором

```
POST /pushes/pushToken

{
    "push":{
        "token":"ExponentPushToken[JIMNXTC3gVhgNbQO4WSvNs]",
        "title":"title", 
        "content":"content"
    }
}
```
</details>

## Одному пользователю(email)

<details>
<summary>Запрос</summary>
Пользователь должен быть администратором

```
POST /pushes/email

{
    "push":{
        "title":"title", 
        "content":"content"
    },
    "email":"your@email.com"
}
```
</details>

## Одному пользователю(userId)

<details>
<summary>Запрос</summary>
Пользователь должен быть администратором

```
POST /pushes/userId

{
    "push":{
        "title":"title", 
        "content":"content"
    },
    "userId":"userId"
}
```
</details>

<details>
<summary>Ответ</summary>
```
DONE!
```

</details>

## Всем пользователям 

<details><summary>Запрос</summary>
Пользователь должен быть администратором

```
POST /pushes/all

{
    "push":{
        "title":"title", 
        "content":"content"
    }
}
```

</details>

<details>
<summary>Ответ</summary>
```
DONE!
```

</details>

## Группе пользователей пользователей 

<details><summary>Запрос</summary>
Пользователь должен быть администратором

```
POST /pushes/group

{
    "push":{
        "title":"title", 
        "content":"content"
    }
    groupId:"d53ebdd4-2daa-482e-8f2b-e2d854532bf4"
}
```

</details>

<details>
<summary>Ответ</summary>

```
DONE!
```

</details>

</details>
<br><br>

<details><summary>Аутентификация</summary>

## **Регистрация**
   <details>
<summary>Запрос</summary>
   
   ```
   POST /api/auth/register
   
   {
    "name":"username",
    "surname":"usersurname",
    "patronymic":"userpatronymic",
    "email":"mikmez01@gmail.com",
    "password":"Eragysygu",
    "phone":89999999999,
    "cityId":"5a7479ca-093e-4a35-8910-1fd3e8528b07",
    "client":"person"
}
   ```

</details>
<details>
<summary>Ответ</summary>

   ```
   {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyYTE3YzFkOC1hOTA1LTRlMmItYmMzZS03NTJkYmFhYmIxMzMiLCJpYXQiOjE2ODUzMzM2NTgsImV4cCI6MTY4NTQyMDA1OH0.g6Csq54yFQRZ123ZlbVde-xIDaOjE-_ai-kr4j57AMM",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyYTE3YzFkOC1hOTA1LTRlMmItYmMzZS03NTJkYmFhYmIxMzMiLCJqdGkiOiJiZjlmNDg2MC0wZjA5LTRjMmItYjY3ZS1hNWRlOGI2ZjNjNTUiLCJpYXQiOjE2ODUzMzM2NTgsImV4cCI6MTY4NTkzODQ1OH0.fZI9GB-avNVeCbKGrnTo1swu56VFmc-_K8x5p-7xAdI"
}
```

</details>

## **Логин**
   <details>
<summary>Запрос</summary>
   
   ```
   POST /api/auth/login

{
    "email":"mikmez01@gmail.com",
    "password":"123456"
}
   ```

</details>
<details>
<summary>Ответ</summary>

   ```
   {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyYTE3YzFkOC1hOTA1LTRlMmItYmMzZS03NTJkYmFhYmIxMzMiLCJpYXQiOjE2ODUzMzM2NTgsImV4cCI6MTY4NTQyMDA1OH0.g6Csq54yFQRZ123ZlbVde-xIDaOjE-_ai-kr4j57AMM",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyYTE3YzFkOC1hOTA1LTRlMmItYmMzZS03NTJkYmFhYmIxMzMiLCJqdGkiOiJiZjlmNDg2MC0wZjA5LTRjMmItYjY3ZS1hNWRlOGI2ZjNjNTUiLCJpYXQiOjE2ODUzMzM2NTgsImV4cCI6MTY4NTkzODQ1OH0.fZI9GB-avNVeCbKGrnTo1swu56VFmc-_K8x5p-7xAdI"
}
```

</details>

## **Рефреш**
<details>
<summary>Запрос</summary>
   
   ```
   POST /api/auth/refreshToken
   
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiZTM5YjRlZS0wNmMzLTRlZWEtYWU3YS1kM2JkZWQwMDY5ZWYiLCJqdGkiOiJiY2VhM2EwZi03N2RkLTQ3MzctODgyYi1jZjAzYWFhZjMyMDUiLCJpYXQiOjE2ODQ5MjQzMDAsImV4cCI6MTY4NTUyOTEwMH0.HFwFjDnG8fKGOtIrrfnKxfc0Rim_4nQF-L0zpGmuxZg"
}
   ```

</details>
<details>
<summary>Ответ</summary>

   ```
   {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyYTE3YzFkOC1hOTA1LTRlMmItYmMzZS03NTJkYmFhYmIxMzMiLCJpYXQiOjE2ODUzMzM2NTgsImV4cCI6MTY4NTQyMDA1OH0.g6Csq54yFQRZ123ZlbVde-xIDaOjE-_ai-kr4j57AMM",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyYTE3YzFkOC1hOTA1LTRlMmItYmMzZS03NTJkYmFhYmIxMzMiLCJqdGkiOiJiZjlmNDg2MC0wZjA5LTRjMmItYjY3ZS1hNWRlOGI2ZjNjNTUiLCJpYXQiOjE2ODUzMzM2NTgsImV4cCI6MTY4NTkzODQ1OH0.fZI9GB-avNVeCbKGrnTo1swu56VFmc-_K8x5p-7xAdI"
}
```

</details>

</details>

## <br>
<details><summary>Пользователь</summary>

## **Получить профиль**
<details>
<summary>Запрос</summary>
   
   ```
   POST /api/users/profile
   
   *bearer token*
   ```

</details>
<details>
<summary>Ответ</summary>

   ```
{
    "id": "be39b4ee-06c3-4eea-ae7a-d3bded0069ef",
    "name": "admin",
    "surname": "admin",
    "patronymic": "admin",
    "email": "mikmez01@gmail.com",
    "auto_updating": true,
    "auto_paying": true,
    "hash_rst": null,
    "hash_vrf": null,
    "token": "myNewToken",
    "phone": "8999999999",
    "status": "active",
    "client": "local",
    "role": "administrator",
    "cityId": "491405c1-0fcb-4e66-9f63-be0dbe6000c4",
    "createdAt": "2023-05-05T06:36:51.301Z",
    "updatedAt": "2023-05-17T11:01:05.340Z"
}
```

</details>

## **Изменить профиль**
<details>
<summary>Запрос</summary>

Все параметры опциональны
   ```
   POST /api/users/profile
   
   *bearer token*

{
    "name":"admin"
    "surname":"admin"
    "patronymic":"admin"
    "email":"admin@gmail.com"
    "auto_updating":true
    "auto_paying":true
    "phone":89999999999
    "cityId":"491405c1-0fcb-4e66-9f63-be0dbe6000c4"
}
   ```

</details>
<details>
<summary>Ответ</summary>

   ```
{
    "id": "be39b4ee-06c3-4eea-ae7a-d3bded0069ef",
    "name": "admin",
    "surname": "admin",
    "patronymic": "admin",
    "email": "mikmez01@gmail.com",
    "auto_updating": true,
    "auto_paying": true,
    "hash_rst": null,
    "hash_vrf": null,
    "token": "myNewToken",
    "phone": "8999999999",
    "status": "active",
    "client": "local",
    "role": "administrator",
    "cityId": "491405c1-0fcb-4e66-9f63-be0dbe6000c4",
    "createdAt": "2023-05-05T06:36:51.301Z",
    "updatedAt": "2023-05-17T11:01:05.340Z"
}
```

</details>

## **Отправить код изменения пароля**
<details>
<summary>Запрос</summary>
   
   ```
   POST /api/users/sendCode
   
   *bearer token*
   ```
</details>

<details>
<summary>Ответ</summary>

```
"code send on your email"
```
(Почта не придет пользователю, если не настроен почтовый микросервис)
</details>

## **Восстановить забытый пароль**
<details>
<summary>Запрос</summary>
   
   ```
   POST /api/users/forgotenPassword
{
    "email":"some user email"
}
   ```

</details>
<details>
<summary>Ответ</summary>

   ```
{
    "DONE!"
}
```
</details>

## **Изменить пароль по коду из почты**
<details>
<summary>Запрос</summary>
   
   ```
   POST /api/users/resetPassword
   
   *bearer token*
   {
    "password":"newPass",
    "code":"code from email",
}
   ```

</details>
<details>
<summary>Ответ</summary>

   ```
{
    "DONE!"
}
```
</details>

## **Установить пуш токен**
<details>
<summary>Запрос</summary>
   
   ```
   POST /api/users/setPushToken
   
   *bearer token*
{
    "token":"myNewToken"
}
   ```

</details>

<details>
<summary>Ответ</summary>

   ```
{
    "DONE!"
}
```
</details>

</details>

## <br>
<details><summary>Экосистема</summary>

<details><summary>Станция</summary>

## **Создать станцию**
<details>
<summary>Запрос</summary>
   
   ```
   POST /api/e/stations/
   
   *bearer token*
{
    "station": {
        "mac":"AF:14:88:02:28:4D",
        "deviceId":"7b8c22f8-350e-42d1-ac96-5a741dea22a4"
    },
    "settings":{
        "name":"newStationName",
        "versionId":"fd8ea0e0-2cbf-4635-afb1-89b696434caf"
    }
}
   ```

</details>

<details>
<summary>Ответ</summary>

   ```
{
    "newStationId"
}
```
</details>

## **Получить все станции пользователя**
<details>
<summary>Запрос</summary>
   
   ```
   GET /api/e/stations/all
   
   *bearer token*
   ```

</details>

<details>
<summary>Ответ</summary>

   ```
[
    {
        "settings": {
            "id": "eb0e3ecb-1a84-412c-bf4e-115d0e417bda",
            "name": "work please",
            "stationId": "e7c7aa94-f526-47b0-ae19-bc5c211625e8",
            "versionId": "fd8ea0e0-2cbf-4635-afb1-89b696434caf",
            "options": null
        },
        "sensors": [
            {
                "settings": {
                    "id": "22676d25-7074-471b-8f4b-385ce300f4a9",
                    "name": "admin",
                    "sleep": "10",
                    "alert": false,
                    "lost": false,
                    "sensorId": "dc0054f5-899a-46b7-a456-5f09f8cd075d",
                    "versionId": "a1cd032b-647d-4552-aa47-bc1c141507e8",
                    "pushStart": null,
                    "pushEnd": null,
                    "triggerMin": null,
                    "triggerMax": null,
                    "schedule": null,
                    "options": null
                },
                "data": [
                    {
                        "id": "afee215d-32ba-47ce-87ab-74bdde33f889",
                        "value": {
                            "говно": 1337,
                            "любое": true,
                            "единицы": 1111111,
                            "измерения": "%"
                        },
                        "sensorId": "dc0054f5-899a-46b7-a456-5f09f8cd075d",
                        "createdAt": "2023-05-17T11:37:29.770Z"
                    }
                ]
            }
        ]
    },
    {
        "settings": {
            "id": "0e730c93-f3ce-4c2c-85bc-c72a23cd9cbe",
            "name": "адам",
            "stationId": "a4ee12c4-d987-47a8-9317-9260fe71d831",
            "versionId": "fd8ea0e0-2cbf-4635-afb1-89b696434caf",
            "options": null
        },
        "sensors": []
    },
    {
        "settings": {
            "id": "63cb7880-95a8-4d29-890e-03b5a6264fbc",
            "name": "адам",
            "stationId": "d3b944ac-96da-4e37-aede-06706e5d201b",
            "versionId": "fd8ea0e0-2cbf-4635-afb1-89b696434caf",
            "options": null
        },
        "sensors": []
    }
]
```
</details>

## **Получить станцию по id**
<details>
<summary>Запрос</summary>
   
   ```
   GET /api/e/stations?id=yourStationId
   
   *bearer token*
   ```

</details>

<details>
<summary>Ответ</summary>

   ```
{
    {
    "id": "e7c7aa94-f526-47b0-ae19-bc5c211625e8",
    "mac": "AF:14:88:02:28:4D",
    "userId": "be39b4ee-06c3-4eea-ae7a-d3bded0069ef",
    "deviceId": "7b8c22f8-350e-42d1-ac96-5a741dea22a4",
    "sensors": [
        allYourSensors
    ]
}
}
```
</details>

## **Изменить станцию**
<details>
<summary>Запрос</summary>
Все поля настроек - опциональны   
```
PUT /api/e/stations/settings
*bearer token* 
{
    "station":{
        "id":"e7c7aa94-f526-47b0-ae19-bc5c211625e8"
    },
    "settings":{
        "name":"work please",
        "versionId": "fd8ea0e0-2cbf-4635-afb1-89b696434caf",
        "options": {all: what,
                    you: want}
        },
        cityId:"needed city id"
}
   ```

</details>

<details>
<summary>Ответ</summary>

```
{
    {
    "id": "eb0e3ecb-1a84-412c-bf4e-115d0e417bda",
    "name": "work please",
    "stationId": "e7c7aa94-f526-47b0-ae19-bc5c211625e8",
    "versionId": "fd8ea0e0-2cbf-4635-afb1-89b696434caf",
    "options": null
    }
}
```
</details>


## **Удалить станцию**
<details>
<summary>Запрос</summary>
Все поля настроек - опциональны   

```
DELETE /api/e/stations/

*bearer token* 
{
    "station":{
        "id":"b4c3fa1f-cd30-4827-af8f-75204c082fd7"
    }
}
```

</details>

<details>
<summary>Ответ</summary>

```
{
    "id": "a4ee12c4-d987-47a8-9317-9260fe71d831",
    "mac": "AF:14:88:02:28:4D",
    "userId": "be39b4ee-06c3-4eea-ae7a-d3bded0069ef",
    "deviceId": "7b8c22f8-350e-42d1-ac96-5a741dea22a4",
    "sensors": []
}
```

</details>

## 
</details>

<details><summary>Сенсор</summary>

## **Создать сенсор**
<details>
<summary>Запрос</summary>

```
POST /api/e/sensors/

*bearer token* 
{
    "sensor": {
        "mac":"AF:14:88:00:84:5H",
        "deviceId":"30bdffcb-dfe9-4e3d-b74d-4996e55aed06"
 
        },
    "settings":{
        "name":"admin",
        "versionId":"a1cd032b-647d-4552-aa47-bc1c141507e8"
    },
        "stationId":"e7c7aa94-f526-47b0-ae19-bc5c211625e8"
}
```

</details>

<details>
<summary>Ответ</summary>

```
{
    "newSensorId"
}
```

</details>

## **Получить сенсор**
<details>
<summary>Запрос</summary>
Параметры withSettings и withData являются опциональными.

При withSettings = true покажутся настройки сенсора.  
При withData = true покажутся все отправленные данные с этого датчика.

```
GET /api/e/sensors/?id=35c4ad0f-3aa8-4559-9f17-75fa4d0c2e77&withData=true&withSettings=true

*bearer token* 
```

</details>

<details>
<summary>Ответ</summary>

```
{
    "id": "dc0054f5-899a-46b7-a456-5f09f8cd075d",
    "mac": "AF:14:88:00:84:5H",
    "uptime": "1000",
    "charge": 100,
    "deviceId": "30bdffcb-dfe9-4e3d-b74d-4996e55aed06",
    "stationId": "e7c7aa94-f526-47b0-ae19-bc5c211625e8",
    "data": [
        {
            "id": "df2f339f-a814-4c75-b6b8-b75c393dab4d",
            "value": {
                "говно": 100,
                "любое": true,
                "единицы": 1111111,
                "измерения": "%"
            },
            "sensorId": "dc0054f5-899a-46b7-a456-5f09f8cd075d",
            "createdAt": "2023-05-12T12:27:56.042Z"
        },
        {
            "id": "e49e20f6-fff3-4bc5-b19c-3a8269f2357f",
            "value": {
                "говно": 50,
                "любое": true,
                "единицы": 1111111,
                "измерения": "%"
            },
            "sensorId": "dc0054f5-899a-46b7-a456-5f09f8cd075d",
            "createdAt": "2023-05-12T12:27:56.042Z"
        },
        {
            "id": "29653cc1-827f-40c0-bab3-1df133194f5b",
            "value": {
                "говно": 1337,
                "любое": true,
                "единицы": 1111111,
                "измерения": "%"
            },
            "sensorId": "dc0054f5-899a-46b7-a456-5f09f8cd075d",
            "createdAt": "2023-05-16T06:12:21.868Z"
        },
        {
            "id": "d237130f-2537-4e0a-97ed-92d8a22cd5f0",
            "value": {
                "говно": 1337,
                "любое": true,
                "единицы": 1111111,
                "измерения": "%"
            },
            "sensorId": "dc0054f5-899a-46b7-a456-5f09f8cd075d",
            "createdAt": "2023-05-17T06:30:31.784Z"
        },
        {
            "id": "afee215d-32ba-47ce-87ab-74bdde33f889",
            "value": {
                "говно": 1337,
                "любое": true,
                "единицы": 1111111,
                "измерения": "%"
            },
            "sensorId": "dc0054f5-899a-46b7-a456-5f09f8cd075d",
            "createdAt": "2023-05-17T11:37:29.770Z"
        }
    ],
    "settings": {
        "id": "22676d25-7074-471b-8f4b-385ce300f4a9",
        "name": "admin",
        "sleep": "10",
        "alert": false,
        "lost": false,
        "sensorId": "dc0054f5-899a-46b7-a456-5f09f8cd075d",
        "versionId": "a1cd032b-647d-4552-aa47-bc1c141507e8",
        "pushStart": null,
        "pushEnd": null,
        "triggerMin": null,
        "triggerMax": null,
        "schedule": null,
        "options": null
    }
}
```

</details>

## **Изменить сенсор**
<details>
<summary>Запрос</summary>
Все параметры настроек являются опциональными

```
PUT /api/e/sensors/settings

*bearer token* 
{
    "sensor":{
        "id":"35c4ad0f-3aa8-4559-9f17-75fa4d0c2e77"
    },
    "settings":{
        "triggerMin":10,
        "triggerMax":100,
        "alert":true,
        "sleep":10,
        "name":"standart",
        "pushStart": "05 October 2011 14:48 UTC GMT+0000",
        "pushEnd": "05 October 2011 23:48 UTC GMT+0000"
    }
}
```

</details>

<details>
<summary>Ответ</summary>

```
{
    "SensorSettingsId"
}
```

</details>


## **Удалить сенсор**
<details>
<summary>Запрос</summary>

```
DELETE /api/e/sensors/

*bearer token* 
{
    "sensor":{
        "id":"3730c09a-3ac1-4d3e-8c62-32340bf1a1b9"
        }
}
```

</details>

<details>
<summary>Ответ</summary>

```
{
    "SensorId"
}
```

</details>

</details>

## 
<details><summary>Версии</summary>

## **Загрузить версию на сервер**
<details>
<summary>Запрос</summary>

```
POST /api/e/versions/

*bearer token*
*Form-data* 
{
    fileUrl:(yourFile),
    description:"text",
    version:"title"
    deviceId:"7b8c22f8-350e-42d1-ac96-5a741dea22a4"
}
```

</details>

<details>
<summary>Ответ</summary>

```
{
    "id": "4b53632b-7f60-460a-92af-125e2dcd95e0",
    "fileUrl": "myFile.bin",
    "servFileUrl": "4a22250ef20e36f31b354f07a32cabd4.bin",
    "description": "test",
    "version": "title",
    "deviceId": "7b8c22f8-350e-42d1-ac96-5a741dea22a4"
}
```

</details>

## **Получить список версий**
<details>
<summary>Запрос</summary>

```
GET /api/e/versions/

*bearer token*
```

</details>

<details>
<summary>Ответ</summary>

```
{
[
    {
        "id": "a1cd032b-647d-4552-aa47-bc1c141507e8",
        "fileUrl": "test.jpg",
        "servFileUrl": "",
        "description": "sensor",
        "version": "versionForSensor",
        "deviceId": "30bdffcb-dfe9-4e3d-b74d-4996e55aed06"
    },
    {
        "id": "fd8ea0e0-2cbf-4635-afb1-89b696434caf",
        "fileUrl": "test.jpg",
        "servFileUrl": "",
        "description": "station",
        "version": "versionForStation",
        "deviceId": "7b8c22f8-350e-42d1-ac96-5a741dea22a4"
    },
    {
        "id": "f053406a-a6aa-4067-aee2-d6a038bb8efb",
        "fileUrl": "1.png",
        "servFileUrl": "",
        "description": "sensor",
        "version": "versionForStation",
        "deviceId": "7b8c22f8-350e-42d1-ac96-5a741dea22a4"
    },
    {
        "id": "5aff4cca-a1b0-4183-9ee5-a1cf9c008fde",
        "fileUrl": "Снимок экрана 2023-05-12 153738.png",
        "servFileUrl": "b2af234d928f5cf2d986c14de8642b8a.bin",
        "description": "test",
        "version": "title",
        "deviceId": "7b8c22f8-350e-42d1-ac96-5a741dea22a4"
    },
    {
        "id": "4b53632b-7f60-460a-92af-125e2dcd95e0",
        "fileUrl": "Снимок экрана 2023-05-12 153738.png",
        "servFileUrl": "4a22250ef20e36f31b354f07a32cabd4.bin",
        "description": "test",
        "version": "title",
        "deviceId": "7b8c22f8-350e-42d1-ac96-5a741dea22a4"
    }
]
}
```

</details>


## **Загрузить версию на устройство**
<details>
<summary>Запрос</summary>

```
GET /api/e/versions/download?id=yourVersionId

*bearer token*
```

</details>

<details>
<summary>Ответ</summary>
Начнется загрузка файла на устройство

</details>

</details>

## 
<details><summary>Данные</summary>

## **Отправить данные**
<details>
<summary>Запрос</summary>
Параметр value может иметь любые значения

Параметры charge и uptime - опциональны


```
POST api/e/data/

{
    "data":{
        "value":{
            "любое":true,
            "говно":1337,
            "единицы":1111111,
            "измерения":"%"
            }
    },
    
    "sensor":{
        "id":"dc0054f5-899a-46b7-a456-5f09f8cd075d",
        "charge":100,
        "uptime":1000
    }
}
```

</details>

<details>
<summary>Ответ</summary>

```
{
    "id": "57b317cc-351d-487a-9749-3f78a7a7b091",
    "value": {
        "говно": 1337,
        "любое": true,
        "единицы": 1111111,
        "измерения": "%"
    },
    "sensorId": "dc0054f5-899a-46b7-a456-5f09f8cd075d",
    "createdAt": "2023-05-30T09:20:11.157Z"
}
```

</details>


## **Получить данные за определенный временной период**
<details>
<summary>Запрос</summary>
Параметр value может иметь любые значения

Параметры charge и uptime - опциональны


```
GET /api/e/data/?dateFrom=(yourDate)&dateTo=(yourSecondDate)&sensorId=(yourSensorId)
*bearer token*
```

</details>

<details>
<summary>Ответ</summary>
Все данные за временной период

```
[
    {
        "id": "df2f339f-a814-4c75-b6b8-b75c393dab4d",
        "value": {
            "говно": 100,
            "любое": true,
            "единицы": 1111111,
            "измерения": "%"
        },
        "sensorId": "dc0054f5-899a-46b7-a456-5f09f8cd075d",
        "createdAt": "2023-05-12T12:27:56.042Z"
    },
    {
        "id": "e49e20f6-fff3-4bc5-b19c-3a8269f2357f",
        "value": {
            "говно": 50,
            "любое": true,
            "единицы": 1111111,
            "измерения": "%"
        },
        "sensorId": "dc0054f5-899a-46b7-a456-5f09f8cd075d",
        "createdAt": "2023-05-12T12:27:56.042Z"
    }
]
```

</details>

</details>

##
<details><summary>Города</summary>

## **Получить список всех городов**
<details>
<summary>Запрос</summary>

```
GET api/e/cities/
```

</details>

<details>
<summary>Ответ</summary>
Список всех городов и их Id

</details>


</details>


##
<details><summary>Типы устройств</summary>

## **Добавить тип устройства**
<details>
<summary>Запрос</summary>
Пользователь должен быть разработчиком или администратором

```
POST api/e/devices/
*bearer token*
{
    "device":{
        "name":"someType"
    }
}
```

</details>

<details>
<summary>Ответ</summary>
Id нового типа устройства

</details>

<details>

## **Получить список всех типов устройств**
<summary>Запрос</summary>
Пользователь должен быть разработчиком или администратором

```
GET api/e/devices/
*bearer token*
```

</details>

<details>
<summary>Ответ</summary>
Список всех типов устройств и их Id

</details>

</details>
</details>


<details><summary>сценарии</summary>

## **Получить сценарий**
<details>
<summary>Запрос</summary>

```
GET api/shelldues/shelldue/:shelldueId
```

</details>

## **Получить сценарии станции**
<details>
<summary>Запрос</summary>

```
GET api/station/:stationId
```

</details>


## **Получить сценарии пользователя**
<details>
<summary>Запрос</summary>

```
GET api/shelldues/user
```

</details>

## **Отправить сценарий**
<details>
<summary>Запрос</summary>

```
POST api/shelldues

{
    name            String
    shelldueScript  Json?
    stationId       String    @unique
}
```

</details>

## **Изменить сценарий**
<details>
<summary>Запрос</summary>

```
PUT api/shelldues/shelldue/:shelldueId

{
    name            String
    shelldueScript  Json?
    stationId       String    @unique
}
```

</details>

## **Удалить сценарий**
<details>
<summary>Запрос</summary>

```
DELETE api/shelldues/shelldue/:shelldueId
```

</details>

</details>
