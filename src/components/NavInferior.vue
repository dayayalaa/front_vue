<template>
    <nav>
        <div class="flex items-center justify-center min-h-screen antialiased bg-gray-100">
            <div
                class="relative flex items-center px-6 overflow-hidden bg-white border-4 border-purple-500 h-28 rounded-2xl">
                <nav class="flex items-center justify-center gap-8">
                    <ul>
                        <li>
                            <a href="#" class="grid w-16 h-16 grid-cols-1 grid-rows-1">Home</a>
                        </li>
                        <li>
                            <a href="#" class="grid w-16 h-16 grid-cols-1 grid-rows-1">Crear</a>
                        </li>
                        <li>
                            <a href="#" class="grid w-16 h-16 grid-cols-1 grid-rows-1">Perfil</a>
                        </li>
                    </ul>

                </nav>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: "Navbar",
};
</script>