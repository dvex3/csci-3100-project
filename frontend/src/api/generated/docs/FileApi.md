# FileApi

All URIs are relative to */api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteFileAction**](#deletefileaction) | **DELETE** /file/{file_uuid} | Delete a file|
|[**getFileAction**](#getfileaction) | **GET** /file/{file_uuid} | Retrieve content of a file|
|[**getUploadFile**](#getuploadfile) | **GET** /file/upload | Retrieve info of all files from a user|
|[**postUploadFile**](#postuploadfile) | **POST** /file/upload | Upload a file to the server|

# **deleteFileAction**
> deleteFileAction()


### Example

```typescript
import {
    FileApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FileApi(configuration);

let fileUuid: string; //File UUID. (default to undefined)

const { status, data } = await apiInstance.deleteFileAction(
    fileUuid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fileUuid** | [**string**] | File UUID. | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**500** | Internal server error. |  -  |
|**401** | Token is invalid or expired. |  -  |
|**404** | File not found. |  -  |
|**400** | Validation error. |  -  |
|**200** | File deleted successfully. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getFileAction**
> FileContentModel getFileAction()


### Example

```typescript
import {
    FileApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FileApi(configuration);

let fileUuid: string; //File UUID. (default to undefined)

const { status, data } = await apiInstance.getFileAction(
    fileUuid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fileUuid** | [**string**] | File UUID. | defaults to undefined|


### Return type

**FileContentModel**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**500** | Internal server error. |  -  |
|**401** | Token is invalid or expired. |  -  |
|**404** | File not found. |  -  |
|**400** | Validation error. |  -  |
|**200** | Success |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUploadFile**
> FileInfoListResponse getUploadFile()


### Example

```typescript
import {
    FileApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FileApi(configuration);

const { status, data } = await apiInstance.getUploadFile();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**FileInfoListResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**500** | Internal server error. |  -  |
|**400** | Validation error. |  -  |
|**401** | Token is invalid or expired. |  -  |
|**200** | Success |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postUploadFile**
> postUploadFile()


### Example

```typescript
import {
    FileApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FileApi(configuration);

let name: string; // (default to undefined)
let file: File; // (default to undefined)

const { status, data } = await apiInstance.postUploadFile(
    name,
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] |  | defaults to undefined|
| **file** | [**File**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**500** | Internal server error. |  -  |
|**400** | Validation error. |  -  |
|**401** | Token is invalid or expired. |  -  |
|**201** | File was successfully created. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

