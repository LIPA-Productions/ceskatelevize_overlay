<script lang="ts">
    import { Router, Route } from 'svelte-routing'
    import Index from './lib/pages/Index.svelte';
    import Dashboard from "./lib/pages/Dasboard.svelte";
</script>

<svelte:head>
    <title>Render grafiky</title>
    <meta name="robots" content="noindex nofollow" />
    <html lang="en" />
</svelte:head>

<Router>
    <Route component={Index} />
    <Route path="/casomira" component={Dashboard}/>
</Router>
