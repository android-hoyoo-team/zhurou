//
// DO NOT MODIFY! THIS IS AUTOGENERATED FILE!
//
namespace Cef3.Interop
{
    using System;
    using System.Diagnostics.CodeAnalysis;
    using System.Runtime.InteropServices;
    using System.Security;
    
    [StructLayout(LayoutKind.Sequential, Pack = libcef.ALIGN)]
    [SuppressMessage("Microsoft.Design", "CA1049:TypesThatOwnNativeResourcesShouldBeDisposable")]
    internal unsafe struct cef_response_t
    {
        internal cef_base_t _base;
        internal IntPtr _is_read_only;
        internal IntPtr _get_status;
        internal IntPtr _set_status;
        internal IntPtr _get_status_text;
        internal IntPtr _set_status_text;
        internal IntPtr _get_mime_type;
        internal IntPtr _set_mime_type;
        internal IntPtr _get_header;
        internal IntPtr _get_header_map;
        internal IntPtr _set_header_map;
        
        // Create
        [DllImport(libcef.DllName, EntryPoint = "cef_response_create", CallingConvention = libcef.CEF_CALL)]
        public static extern cef_response_t* create();
        
        [UnmanagedFunctionPointer(libcef.CEF_CALLBACK)]
        #if !DEBUG
        [SuppressUnmanagedCodeSecurity]
        #endif
        private delegate int add_ref_delegate(cef_response_t* self);
        
        [UnmanagedFunctionPointer(libcef.CEF_CALLBACK)]
        #if !DEBUG
        [SuppressUnmanagedCodeSecurity]
        #endif
        private delegate int release_delegate(cef_response_t* self);
        
        [UnmanagedFunctionPointer(libcef.CEF_CALLBACK)]
        #if !DEBUG
        [SuppressUnmanagedCodeSecurity]
        #endif
        private delegate int get_refct_delegate(cef_response_t* self);
        
        [UnmanagedFunctionPointer(libcef.CEF_CALLBACK)]
        #if !DEBUG
        [SuppressUnmanagedCodeSecurity]
        #endif
        private delegate int is_read_only_delegate(cef_response_t* self);
        
        [UnmanagedFunctionPointer(libcef.CEF_CALLBACK)]
        #if !DEBUG
        [SuppressUnmanagedCodeSecurity]
        #endif
        private delegate int get_status_delegate(cef_response_t* self);
        
        [UnmanagedFunctionPointer(libcef.CEF_CALLBACK)]
        #if !DEBUG
        [SuppressUnmanagedCodeSecurity]
        #endif
        private delegate void set_status_delegate(cef_response_t* self, int status);
        
        [UnmanagedFunctionPointer(libcef.CEF_CALLBACK)]
        #if !DEBUG
        [SuppressUnmanagedCodeSecurity]
        #endif
        private delegate cef_string_userfree* get_status_text_delegate(cef_response_t* self);
        
        [UnmanagedFunctionPointer(libcef.CEF_CALLBACK)]
        #if !DEBUG
        [SuppressUnmanagedCodeSecurity]
        #endif
        private delegate void set_status_text_delegate(cef_response_t* self, cef_string_t* statusText);
        
        [UnmanagedFunctionPointer(libcef.CEF_CALLBACK)]
        #if !DEBUG
        [SuppressUnmanagedCodeSecurity]
        #endif
        private delegate cef_string_userfree* get_mime_type_delegate(cef_response_t* self);
        
        [UnmanagedFunctionPointer(libcef.CEF_CALLBACK)]
        #if !DEBUG
        [SuppressUnmanagedCodeSecurity]
        #endif
        private delegate void set_mime_type_delegate(cef_response_t* self, cef_string_t* mimeType);
        
        [UnmanagedFunctionPointer(libcef.CEF_CALLBACK)]
        #if !DEBUG
        [SuppressUnmanagedCodeSecurity]
        #endif
        private delegate cef_string_userfree* get_header_delegate(cef_response_t* self, cef_string_t* name);
        
        [UnmanagedFunctionPointer(libcef.CEF_CALLBACK)]
        #if !DEBUG
        [SuppressUnmanagedCodeSecurity]
        #endif
        private delegate void get_header_map_delegate(cef_response_t* self, cef_string_multimap* headerMap);
        
        [UnmanagedFunctionPointer(libcef.CEF_CALLBACK)]
        #if !DEBUG
        [SuppressUnmanagedCodeSecurity]
        #endif
        private delegate void set_header_map_delegate(cef_response_t* self, cef_string_multimap* headerMap);
        
        // AddRef
        private static IntPtr _p0;
        private static add_ref_delegate _d0;
        
        public static int add_ref(cef_response_t* self)
        {
            add_ref_delegate d;
            var p = self->_base._add_ref;
            if (p == _p0) { d = _d0; }
            else
            {
                d = (add_ref_delegate)Marshal.GetDelegateForFunctionPointer(p, typeof(add_ref_delegate));
                if (_p0 == IntPtr.Zero) { _d0 = d; _p0 = p; }
            }
            return d(self);
        }
        
        // Release
        private static IntPtr _p1;
        private static release_delegate _d1;
        
        public static int release(cef_response_t* self)
        {
            release_delegate d;
            var p = self->_base._release;
            if (p == _p1) { d = _d1; }
            else
            {
                d = (release_delegate)Marshal.GetDelegateForFunctionPointer(p, typeof(release_delegate));
                if (_p1 == IntPtr.Zero) { _d1 = d; _p1 = p; }
            }
            return d(self);
        }
        
        // GetRefCt
        private static IntPtr _p2;
        private static get_refct_delegate _d2;
        
        public static int get_refct(cef_response_t* self)
        {
            get_refct_delegate d;
            var p = self->_base._get_refct;
            if (p == _p2) { d = _d2; }
            else
            {
                d = (get_refct_delegate)Marshal.GetDelegateForFunctionPointer(p, typeof(get_refct_delegate));
                if (_p2 == IntPtr.Zero) { _d2 = d; _p2 = p; }
            }
            return d(self);
        }
        
        // IsReadOnly
        private static IntPtr _p3;
        private static is_read_only_delegate _d3;
        
        public static int is_read_only(cef_response_t* self)
        {
            is_read_only_delegate d;
            var p = self->_is_read_only;
            if (p == _p3) { d = _d3; }
            else
            {
                d = (is_read_only_delegate)Marshal.GetDelegateForFunctionPointer(p, typeof(is_read_only_delegate));
                if (_p3 == IntPtr.Zero) { _d3 = d; _p3 = p; }
            }
            return d(self);
        }
        
        // GetStatus
        private static IntPtr _p4;
        private static get_status_delegate _d4;
        
        public static int get_status(cef_response_t* self)
        {
            get_status_delegate d;
            var p = self->_get_status;
            if (p == _p4) { d = _d4; }
            else
            {
                d = (get_status_delegate)Marshal.GetDelegateForFunctionPointer(p, typeof(get_status_delegate));
                if (_p4 == IntPtr.Zero) { _d4 = d; _p4 = p; }
            }
            return d(self);
        }
        
        // SetStatus
        private static IntPtr _p5;
        private static set_status_delegate _d5;
        
        public static void set_status(cef_response_t* self, int status)
        {
            set_status_delegate d;
            var p = self->_set_status;
            if (p == _p5) { d = _d5; }
            else
            {
                d = (set_status_delegate)Marshal.GetDelegateForFunctionPointer(p, typeof(set_status_delegate));
                if (_p5 == IntPtr.Zero) { _d5 = d; _p5 = p; }
            }
            d(self, status);
        }
        
        // GetStatusText
        private static IntPtr _p6;
        private static get_status_text_delegate _d6;
        
        public static cef_string_userfree* get_status_text(cef_response_t* self)
        {
            get_status_text_delegate d;
            var p = self->_get_status_text;
            if (p == _p6) { d = _d6; }
            else
            {
                d = (get_status_text_delegate)Marshal.GetDelegateForFunctionPointer(p, typeof(get_status_text_delegate));
                if (_p6 == IntPtr.Zero) { _d6 = d; _p6 = p; }
            }
            return d(self);
        }
        
        // SetStatusText
        private static IntPtr _p7;
        private static set_status_text_delegate _d7;
        
        public static void set_status_text(cef_response_t* self, cef_string_t* statusText)
        {
            set_status_text_delegate d;
            var p = self->_set_status_text;
            if (p == _p7) { d = _d7; }
            else
            {
                d = (set_status_text_delegate)Marshal.GetDelegateForFunctionPointer(p, typeof(set_status_text_delegate));
                if (_p7 == IntPtr.Zero) { _d7 = d; _p7 = p; }
            }
            d(self, statusText);
        }
        
        // GetMimeType
        private static IntPtr _p8;
        private static get_mime_type_delegate _d8;
        
        public static cef_string_userfree* get_mime_type(cef_response_t* self)
        {
            get_mime_type_delegate d;
            var p = self->_get_mime_type;
            if (p == _p8) { d = _d8; }
            else
            {
                d = (get_mime_type_delegate)Marshal.GetDelegateForFunctionPointer(p, typeof(get_mime_type_delegate));
                if (_p8 == IntPtr.Zero) { _d8 = d; _p8 = p; }
            }
            return d(self);
        }
        
        // SetMimeType
        private static IntPtr _p9;
        private static set_mime_type_delegate _d9;
        
        public static void set_mime_type(cef_response_t* self, cef_string_t* mimeType)
        {
            set_mime_type_delegate d;
            var p = self->_set_mime_type;
            if (p == _p9) { d = _d9; }
            else
            {
                d = (set_mime_type_delegate)Marshal.GetDelegateForFunctionPointer(p, typeof(set_mime_type_delegate));
                if (_p9 == IntPtr.Zero) { _d9 = d; _p9 = p; }
            }
            d(self, mimeType);
        }
        
        // GetHeader
        private static IntPtr _pa;
        private static get_header_delegate _da;
        
        public static cef_string_userfree* get_header(cef_response_t* self, cef_string_t* name)
        {
            get_header_delegate d;
            var p = self->_get_header;
            if (p == _pa) { d = _da; }
            else
            {
                d = (get_header_delegate)Marshal.GetDelegateForFunctionPointer(p, typeof(get_header_delegate));
                if (_pa == IntPtr.Zero) { _da = d; _pa = p; }
            }
            return d(self, name);
        }
        
        // GetHeaderMap
        private static IntPtr _pb;
        private static get_header_map_delegate _db;
        
        public static void get_header_map(cef_response_t* self, cef_string_multimap* headerMap)
        {
            get_header_map_delegate d;
            var p = self->_get_header_map;
            if (p == _pb) { d = _db; }
            else
            {
                d = (get_header_map_delegate)Marshal.GetDelegateForFunctionPointer(p, typeof(get_header_map_delegate));
                if (_pb == IntPtr.Zero) { _db = d; _pb = p; }
            }
            d(self, headerMap);
        }
        
        // SetHeaderMap
        private static IntPtr _pc;
        private static set_header_map_delegate _dc;
        
        public static void set_header_map(cef_response_t* self, cef_string_multimap* headerMap)
        {
            set_header_map_delegate d;
            var p = self->_set_header_map;
            if (p == _pc) { d = _dc; }
            else
            {
                d = (set_header_map_delegate)Marshal.GetDelegateForFunctionPointer(p, typeof(set_header_map_delegate));
                if (_pc == IntPtr.Zero) { _dc = d; _pc = p; }
            }
            d(self, headerMap);
        }
        
    }
}
