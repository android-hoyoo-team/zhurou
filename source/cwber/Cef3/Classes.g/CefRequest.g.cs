//
// DO NOT MODIFY! THIS IS AUTOGENERATED FILE!
//
namespace Cef3
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Runtime.InteropServices;
    using Cef3.Interop;
    
    // Role: PROXY
    public sealed unsafe partial class CefRequest : IDisposable
    {
        internal static CefRequest FromNative(cef_request_t* ptr)
        {
            return new CefRequest(ptr);
        }
        
        internal static CefRequest FromNativeOrNull(cef_request_t* ptr)
        {
            if (ptr == null) return null;
            return new CefRequest(ptr);
        }
        
        private cef_request_t* _self;
        
        private CefRequest(cef_request_t* ptr)
        {
            if (ptr == null) throw new ArgumentNullException("ptr");
            _self = ptr;
        }
        
        ~CefRequest()
        {
            if (_self != null)
            {
                Release();
                _self = null;
            }
        }
        
        public void Dispose()
        {
            if (_self != null)
            {
                Release();
                _self = null;
            }
            GC.SuppressFinalize(this);
        }
        
        internal int AddRef()
        {
            return cef_request_t.add_ref(_self);
        }
        
        internal int Release()
        {
            return cef_request_t.release(_self);
        }
        
        internal int RefCt
        {
            get { return cef_request_t.get_refct(_self); }
        }
        
        internal cef_request_t* ToNative()
        {
            AddRef();
            return _self;
        }
    }
}
