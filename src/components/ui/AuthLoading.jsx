function AuthLoading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8]">
            <div className="text-center">
                <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
                <p className="text-sm text-gray-500">Cargando...</p>
            </div>
        </div>
    );
}

export default AuthLoading;