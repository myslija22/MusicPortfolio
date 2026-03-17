import { Stack, Link as ChakraLink, Button, Box } from "@chakra-ui/react"
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { supabase } from "../../lib/supabase"
import { toaster } from "../ui/toaster"

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {  //https://chakra-ui.com/docs/components/link#routing-library
    const { pathname } = useLocation()

    const isActive = pathname === href

    return (    //gemini.google.com
        <ChakraLink asChild _currentPage={{ color: "blue.500", fontWeight: "bold" }}>
            <RouterLink
                to={href}
                aria-current={isActive ? "page" : undefined}
            >
                {children}
            </RouterLink>
        </ChakraLink>
    )
}

export default function Navbar() {

    const { user, role } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Error during sign out:", error.message);
            localStorage.clear();
            sessionStorage.clear();
        } else {
            console.log("Signed out successfully!");
            toaster.create({
                title: "Signed out successfully!",
                description: "You have been signed out.",
                type: "success",
            });
        }

        navigate("/login");
    }

    return (
        <Box backdropFilter='auto' backdropBlur='100px' position={'fixed'} w={'full'} zIndex={50}>
            <Stack direction="row" h="20" alignItems="center" justifyContent="space-between" px="10" pos={'sticky'}>
                <NavLink href="/">Home</NavLink>
                <NavLink href="/downloads">Demos</NavLink>

                {user && (role === "admin" || role === "vip") && <NavLink href="/exclusive">VIP</NavLink>}
                {user && role === "admin" && <NavLink href="/admin">Dashboard</NavLink>}

                {!user ? (
                    <>
                        <NavLink href="/login">Login</NavLink>
                        <NavLink href="/register">Register</NavLink>
                    </>
                ) : (
                    <Button onClick={handleLogout} variant="ghost" colorScheme="blue" margin={'unset'} padding={'unset'}>
                        Sign Out
                    </Button>
                )}
            </Stack>
        </Box>
    )
}