import './App.css'

function App() {

  return (
    <>
    <header class="flex shadow-md py-4 px-4 sm:px-10 bg-white min-h-[70px] tracking-wide relative z-50">
      <div class="flex flex-wrap items-center justify-between gap-5 w-full">
        <a href="javascript:void(0)" class="max-sm:hidden"><img src="https://readymadeui.com/readymadeui.svg" alt="logo" class="w-36" /></a>
        <a href="javascript:void(0)" class="hidden max-sm:block"><img src="https://readymadeui.com/readymadeui-short.svg" alt="logo" class="w-9" /></a>

        <div id="collapseMenu"
          class="max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50">
          <ul
            class="lg:flex gap-x-4 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
            <li class="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3">
              <a href='javascript:void(0)'
                class="hover:text-blue-700 text-blue-700 block font-medium text-[15px]">Home</a>
            </li>
            <li class="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3"><a href='javascript:void(0)'
              class="hover:text-blue-700 text-slate-900 block font-medium text-[15px]">Team</a>
            </li>
            <li class="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3"><a href='javascript:void(0)'
              class="hover:text-blue-700 text-slate-900 block font-medium text-[15px]">Feature</a>
            </li>
            <li class="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3"><a href='javascript:void(0)'
              class="hover:text-blue-700 text-slate-900 block font-medium text-[15px]">Blog</a>
            </li>
            <li class="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3"><a href='javascript:void(0)'
              class="hover:text-blue-700 text-slate-900 block font-medium text-[15px]">About</a>
            </li>
            <li class="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3"><a href='javascript:void(0)'
              class="hover:text-blue-700 text-slate-900 block font-medium text-[15px]">Contact</a>
            </li>
          </ul>
        </div> 
      </div>
    </header>
    </>
  )
}

export default App
