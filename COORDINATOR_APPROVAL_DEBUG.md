# Coordinator Approval Debugging Guide

## Issue Description
Admin dashboard shows "failed to approve request" error when trying to approve a coordinator request that was resubmitted after rejection.

## Root Cause Analysis

The approval API endpoint (`/api/coordinator-requests/[id]`) has a status check that prevents processing requests that are not in `PENDING` status:

```typescript
if (coordinatorRequest.status !== "PENDING") {
  return NextResponse.json(
    { error: "Request has already been processed" },
    { status: 400 }
  );
}
```

When a user resubmits after rejection, the system updates the existing request to `PENDING` status. However, if the admin dashboard has cached the old status, or if there's a timing issue, the approval might fail.

## Debugging Changes Made

### 1. Enhanced Error Logging in API (`/api/coordinator-requests/[id]/route.ts`)

Added detailed logging to track request status:
```typescript
console.log(`Processing ${action} for request ${id}:`, {
  found: !!coordinatorRequest,
  status: coordinatorRequest?.status,
  email: coordinatorRequest?.email
});
```

Added status information to error message:
```typescript
return NextResponse.json(
  { error: `Request has already been processed (status: ${coordinatorRequest.status})` },
  { status: 400 }
);
```

### 2. Enhanced Error Display in Admin Dashboard (`/app/admin/page.tsx`)

Modified to show the actual error message from API:
```typescript
const data = await res.json()
if (res.ok) {
  toast.success(`Request ${action}d successfully`)
  fetchData()
} else {
  console.error(`Failed to ${action} request:`, data)
  toast.error(data.error || `Failed to ${action} request`)
}
```

### 3. Resubmission Logging (`/api/coordinator-requests/route.ts`)

Added logging to verify status update:
```typescript
console.log(`Resubmitting rejected request for ${email}`);
const updatedRequest = await prisma.coordinatorRequest.update({...});
console.log(`Request updated to PENDING:`, {
  id: updatedRequest.id,
  status: updatedRequest.status,
  email: updatedRequest.email
});
```

## How to Debug

1. **User resubmits a rejected request**
   - Check console logs: "Resubmitting rejected request for [email]"
   - Verify: "Request updated to PENDING" with correct ID and status

2. **Admin tries to approve the request**
   - Check console logs: "Processing approve for request [id]"
   - Verify the status shown in logs is "PENDING"
   - If status is not PENDING, this explains the error

3. **If approval still fails**
   - Check the error message in the toast notification (now shows detailed error)
   - Check browser console for the full error object
   - Check server logs for the status check output

## Potential Issues to Check

### Issue 1: Database Transaction Timing
- The resubmission update might not be committed before admin refreshes
- Solution: Ensure admin refreshes the page after user resubmits

### Issue 2: Stale Admin Dashboard Data
- Admin dashboard might be showing cached request data
- Solution: Force refetch when switching tabs or add a refresh button

### Issue 3: Browser Caching
- Browser might be caching the GET request for coordinator requests
- Solution: Add cache control headers to the API

## Testing Steps

1. As a user, submit a coordinator request
2. As admin, reject the request
3. As user, resubmit the same request (should get "Request resubmitted successfully" message)
4. **Important**: Admin should refresh the coordinator requests list
5. As admin, try to approve the resubmitted request
6. Check console logs and error messages for any issues

## Expected Console Output

### On Resubmission:
```
Resubmitting rejected request for user@example.com
Request updated to PENDING: {
  id: 'clxxx...',
  status: 'PENDING',
  email: 'user@example.com'
}
```

### On Approval:
```
Processing approve for request clxxx...: {
  found: true,
  status: 'PENDING',
  email: 'user@example.com'
}
```

## Next Steps

If the issue persists after these logging improvements:

1. Check the exact error message shown in the toast
2. Compare the request ID in the admin dashboard with the one in console logs
3. Verify the database directly to see the actual status of the request
4. Consider adding a "Refresh" button to the admin dashboard coordinator tab
5. Consider adding optimistic UI updates or real-time subscriptions

## Files Modified

- `src/app/api/coordinator-requests/[id]/route.ts` - Added detailed logging and error messages
- `src/app/admin/page.tsx` - Enhanced error handling to show API error messages
- `src/app/api/coordinator-requests/route.ts` - Added resubmission logging
