using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaseProject.Common
{
    public static class EncryptPassword
    {
        private static string Key = "secret@key@@";

        public static string Encrypt(string passwordRaw)
        {
            if (string.IsNullOrEmpty(passwordRaw)) return "";
            passwordRaw += Key;
            var passwordBytes = Encoding.UTF8.GetBytes(passwordRaw);
            return Convert.ToBase64String(passwordBytes);
        }

        public static bool VerifyPassword(string encoded, string raw) {
            if (string.IsNullOrEmpty(encoded) || string.IsNullOrEmpty(raw)) return false;
            
            var convert = EncryptPassword.Encrypt(raw);

            return encoded == convert;
        }

        public static string Decrypt(string base64String)
        {
            if (string.IsNullOrEmpty(base64String)) return "";

            var base64Bytes = Convert.FromBase64String(base64String);
            var result = Encoding.UTF8.GetString(base64Bytes);
            result = result.Substring(0, result.Length - Key.Length);
            return result;
        }
    }
}
