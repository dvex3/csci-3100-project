# AnnotationApi

All URIs are relative to */api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getGetAnnotation**](#getgetannotation) | **GET** /annotation/{file_uuid} | |
|[**postAnnotate**](#postannotate) | **POST** /annotation/generate | Upload generated chat message to db|

# **getGetAnnotation**
> AnnotationInfoListResponse getGetAnnotation()


### Example

```typescript
import {
    AnnotationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AnnotationApi(configuration);

let fileUuid: string; //File UUID. (default to undefined)

const { status, data } = await apiInstance.getGetAnnotation(
    fileUuid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fileUuid** | [**string**] | File UUID. | defaults to undefined|


### Return type

**AnnotationInfoListResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postAnnotate**
> AnnotationInfoResponse postAnnotate()


### Example

```typescript
import {
    AnnotationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AnnotationApi(configuration);

let functionName: string; // (default to undefined)
let fileUuid: string; // (default to undefined)

const { status, data } = await apiInstance.postAnnotate(
    functionName,
    fileUuid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **functionName** | [**string**] |  | defaults to undefined|
| **fileUuid** | [**string**] |  | defaults to undefined|


### Return type

**AnnotationInfoResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

