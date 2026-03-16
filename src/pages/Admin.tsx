import { useEffect, useState } from 'react';
import { 
    Box, 
    Container, 
    Heading, 
    Text, 
    SimpleGrid, 
    VStack, 
    HStack,
    Button,
    Table,
    Badge,
    Spinner,
    Separator,
    Card,
    FileUpload,
    Icon,
    CloseButton,
    Collapsible,
    NativeSelect
} from '@chakra-ui/react';
import { supabase } from '../lib/supabase';
import { LuUpload } from 'react-icons/lu';
import { HiX, HiChevronDown, HiChevronUp, HiTrash } from 'react-icons/hi';
import { toaster } from '../components/ui/toaster';

interface ProfileData {
    id: string;
    role: string;
    created_at: string;
}

interface TrackData {
    id: number;
    title: string;
    is_exclusive: boolean;
    file_path: string;
}

export default function Admin() {
    const [profiles, setProfiles] = useState<ProfileData[]>([]);
    const [tracks, setTracks] = useState<TrackData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    
    const [usersOpen, setUsersOpen] = useState(false);
    const [tracksOpen, setTracksOpen] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (profileError) console.error("Error fetching profiles:", profileError);
        else if (profileData) setProfiles(profileData);

        const { data: trackData, error: trackError } = await supabase
            .from('tracks')
            .select('id, title, is_exclusive, file_path')
            .order('created_at', { ascending: false });

        if (trackError) console.error("Error fetching tracks:", trackError);
        else if (trackData) setTracks(trackData);

        setLoading(false);
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) {
            toaster.create({ title: "Error updating role", description: error.message, type: "error" });
        } else {
            toaster.create({ title: "Role updated", type: "success" });
            fetchDashboardData();
        }
    };

    const toggleTrackExclusivity = async (track: TrackData) => {
        const { error } = await supabase
            .from('tracks')
            .update({ is_exclusive: !track.is_exclusive })
            .eq('id', track.id);

        if (error) {
            toaster.create({ title: "Error updating track", description: error.message, type: "error" });
            console.error("Update Error:", error);
        } else {
            toaster.create({ title: "Track visibility updated", type: "success" });
            fetchDashboardData();
        }
    };

    const deleteTrack = async (track: TrackData) => { //gemini.google.com
        if (!window.confirm("Are you sure you want to delete this track?")) return;

        if (track.file_path) {
            const { error: storageError } = await supabase.storage
                .from('audio_files')
                .remove([track.file_path]);
                
            if (storageError) {
                console.error("Storage delete fail (proceeding to DB anyway):", storageError.message);
            }
        }

        const { error: dbError } = await supabase
            .from('tracks')
            .delete()
            .eq('id', track.id);

        if (dbError) {
            toaster.create({ title: "Error deleting track", description: dbError.message, type: "error" });
            console.error("Delete Error:", dbError);
        } else {
            toaster.create({ title: "Track deleted", type: "success" });
            fetchDashboardData();
        }
    };

    const handleFileChange = (e: { acceptedFiles: File[] }) => {
        setSelectedFiles(e.acceptedFiles);
    };

    const handleUploadClick = async () => { //gemini.google.com
        if (selectedFiles.length === 0) return;
        
        setIsUploading(true);
        let successCount = 0;
        let errorCount = 0;

        for (const file of selectedFiles) {
            try {
                const fileExt = file.name.split('.').pop();
                const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
                const filePath = `${Date.now()}_${cleanFileName}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('audio_files')
                    .upload(filePath, file, { cacheControl: '3600', upsert: false });

                if (uploadError) throw uploadError;
                const trackTitle = file.name.replace(`.${fileExt}`, '');
                
                const { error: dbError } = await supabase
                    .from('tracks')
                    .insert({ title: trackTitle, file_path: filePath, is_exclusive: false });

                if (dbError) throw dbError; 

                successCount++;
            } catch (error) {
                console.error("Upload process failed:", error);
                errorCount++;
            }
        }

        setIsUploading(false);
        if (successCount > 0) {
            toaster.create({ title: "Uploads Complete", description: `Uploaded ${successCount} track(s).`, type: "success" });
            fetchDashboardData();
            setSelectedFiles([]); 
        } 
        if (errorCount > 0) {
            toaster.create({ title: "Upload Errors", description: `Failed to upload ${errorCount} file(s).`, type: "error" });
        }
    };

    if (loading) {
        return <Box textAlign="center" py={20}><Spinner size="xl" /></Box>;
    }

    return (
        <Container maxW="container.xl" py={10}>
            <VStack gap={8} align="stretch">
                
                <Box>
                    <Heading as="h1" size="2xl">Admin Dashboard</Heading>
                    <Text color="gray.500" mt={2}>Welcome back!</Text>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                    <Card.Root>
                        <Card.Body>
                            <VStack align="start" gap={1}>
                                <Text fontSize="sm" color="gray.500" textTransform="uppercase" fontWeight="bold">Total Users</Text>
                                <Heading size="3xl">{profiles.length}</Heading>
                            </VStack>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root>
                        <Card.Body>
                            <VStack align="start" gap={1}>
                                <Text fontSize="sm" color="gray.500" textTransform="uppercase" fontWeight="bold">Total Tracks</Text>
                                <Heading size="3xl">{tracks.length}</Heading>
                            </VStack>
                        </Card.Body>
                    </Card.Root>
                </SimpleGrid>

                <Separator />

                <Collapsible.Root open={usersOpen} onOpenChange={(e) => setUsersOpen(e.open)}>
                    <Box borderWidth="1px" borderRadius="lg" p={5} shadow="sm" >
                        <Collapsible.Trigger asChild>
                            <Button width="full" variant="ghost" justifyContent="space-between" size="lg" px={0} _hover={{ bg: 'transparent' }}>
                                <Heading size="md">All Users ({profiles.length})</Heading>
                                <Icon>{usersOpen ? <HiChevronUp /> : <HiChevronDown />}</Icon>
                            </Button>
                        </Collapsible.Trigger>
                        
                        <Collapsible.Content>
                            <Box mt={4} maxH="400px" overflowY="auto">
                                <Table.Root size="sm">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeader>User ID</Table.ColumnHeader>
                                            <Table.ColumnHeader>Role</Table.ColumnHeader>
                                            <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {profiles.map((profile) => (
                                            <Table.Row key={profile.id}>
                                                <Table.Cell>
                                                    <Text truncate maxW="150px" fontSize="xs" fontFamily="monospace">{profile.id}</Text>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Badge colorPalette={profile.role === 'admin' ? 'red' : profile.role === 'vip' ? 'orange' : 'gray'}>
                                                        {profile.role}
                                                    </Badge>
                                                </Table.Cell>
                                                <Table.Cell textAlign="right">
                                                    <NativeSelect.Root size="sm" width="fit-content" ml="auto">
                                                        <NativeSelect.Field 
                                                            value={profile.role}
                                                            onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="vip">VIP</option>
                                                            <option value="admin">Admin</option>
                                                        </NativeSelect.Field>
                                                        <NativeSelect.Indicator />
                                                    </NativeSelect.Root>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Root>
                            </Box>
                        </Collapsible.Content>
                    </Box>
                </Collapsible.Root>

                <Collapsible.Root open={tracksOpen} onOpenChange={(e) => setTracksOpen(e.open)}>
                    <Box borderWidth="1px" borderRadius="lg" p={5} shadow="sm">
                        <Collapsible.Trigger asChild>
                            <Button width="full" variant="ghost" justifyContent="space-between" size="lg" px={0} _hover={{ bg: 'transparent' }}>
                                <Heading size="md">All Tracks ({tracks.length})</Heading>
                                <Icon>{tracksOpen ? <HiChevronUp /> : <HiChevronDown />}</Icon>
                            </Button>
                        </Collapsible.Trigger>
                        
                        <Collapsible.Content>
                            <Box mt={4} maxH="400px" overflowY="auto">
                                <Table.Root size="sm">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeader>Title</Table.ColumnHeader>
                                            <Table.ColumnHeader>Access</Table.ColumnHeader>
                                            <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {tracks.map((track) => (
                                            <Table.Row key={track.id}>
                                                <Table.Cell fontWeight="medium">{track.title}</Table.Cell>
                                                <Table.Cell>
                                                    <Badge colorPalette={track.is_exclusive ? 'orange' : 'green'}>
                                                        {track.is_exclusive ? 'VIP' : 'Public'}
                                                    </Badge>
                                                </Table.Cell>
                                                <Table.Cell textAlign="right">
                                                    <HStack justify="flex-end" gap={2}>
                                                        <Button size="xs" variant="outline" onClick={() => toggleTrackExclusivity(track)}>
                                                            Make {track.is_exclusive ? 'Public' : 'VIP'}
                                                        </Button>
                                                        <Button size="xs" colorPalette="red" variant="ghost" onClick={() => deleteTrack(track)}>
                                                            <HiTrash />
                                                        </Button>
                                                    </HStack>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Root>
                            </Box>
                        </Collapsible.Content>
                    </Box>
                </Collapsible.Root>

                <Box mt={4}>
                    <Heading as="h1" size="xl" mb={4}>Upload A New Track</Heading>
                    
                    <FileUpload.Root maxW="full" alignItems="stretch" maxFiles={10} accept={['audio/*']} onFileChange={handleFileChange}>
                        <FileUpload.Dropzone>
                            <FileUpload.HiddenInput />
                            <Icon size="md" color="fg.muted"><LuUpload /></Icon>
                            <FileUpload.DropzoneContent><Box>Drag and drop audio files here</Box></FileUpload.DropzoneContent>
                        </FileUpload.Dropzone>

                        <FileUpload.Context>
                            {({ acceptedFiles }) => (
                                <FileUpload.ItemGroup mt={4}>
                                    {acceptedFiles.map((file: File) => (
                                        <FileUpload.Item file={file} key={file.name} borderWidth="1px" borderRadius="md" p={3} display="flex" justifyContent="space-between" alignItems="center">
                                            <FileUpload.ItemPreview />
                                            <Box flex="1" ml={3} direction={'row'}>
                                                <FileUpload.ItemName fontWeight="medium" />
                                                <FileUpload.ItemSizeText color="gray.500" fontSize="sm" />
                                            </Box>
                                            <FileUpload.ItemDeleteTrigger asChild>
                                                <CloseButton alignSelf={'center'} size={'xl'} variant="ghost" aria-label="Close"><HiX /></CloseButton>
                                            </FileUpload.ItemDeleteTrigger>
                                        </FileUpload.Item>
                                    ))}
                                </FileUpload.ItemGroup>
                            )}
                        </FileUpload.Context>
                    </FileUpload.Root>

                    <Box mt={6} display="flex" justifyContent="flex-end">
                        <Button colorScheme="blue" onClick={handleUploadClick} disabled={selectedFiles.length === 0 || isUploading} loading={isUploading} loadingText="Uploading...">
                            Upload Files to Database
                        </Button>
                    </Box>
                </Box>

            </VStack>
        </Container>
    );
}