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
    public sealed unsafe partial class CefFileDialogCallback : IDisposable
    {
        internal static CefFileDialogCallback FromNative(cef_file_dialog_callback_t* ptr)
        {
            return new CefFileDialogCallback(ptr);
        }
        
        internal static CefFileDialogCallback FromNativeOrNull(cef_file_dialog_callback_t* ptr)
        {
            if (ptr == null) return null;
            return new CefFileDialogCallback(ptr);
        }
        
        private cef_file_dialog_callback_t* _self;
        
        private CefFileDialogCallback(cef_file_dialog_callback_t* ptr)
        {
            if (ptr == null) throw new ArgumentNullException("ptr");
            _self = ptr;
        }
        
        ~CefFileDialogCallback()
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
            return cef_file_dialog_callback_t.add_ref(_self);
        }
        
        internal int Release()
        {
            return cef_file_dialog_callback_t.release(_self);
        }
        
        internal int RefCt
        {
            get { return cef_file_dialog_callback_t.get_refct(_self); }
        }
        
        internal cef_file_dialog_callback_t* ToNative()
        {
            AddRef();
            return _self;
        }
    }
}
