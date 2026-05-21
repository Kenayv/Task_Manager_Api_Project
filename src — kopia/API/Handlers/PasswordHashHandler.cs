public class PasswordHashHandler
{
    //FIXME: ToImplement
    //FIXME: ToImplement
    //FIXME: ToImplement
    //FIXME: ToImplement
    //FIXME: ToImplement

    public static string HashPassword(string password)
    {
        return password;
    }

    public static bool VerifyPassword(string? password1, string? password2)
    {
        if (
            password1 == null
            || password2 == null
            || string.IsNullOrWhiteSpace(password1)
            || string.IsNullOrWhiteSpace(password2)
        )
        {
            return false;
        }

        return true; //FIXME:
    }
}
