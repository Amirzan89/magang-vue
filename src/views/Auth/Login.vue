<script setup lang="ts">
import { reactive } from 'vue';
const input = reactive({
    email: null,
    password: null,
})
</script>
<template>
    <main>
        <div>
            <Form>
                <FormField>
                    <label for="">Email</label>
                    <InputText type="email"></InputText>
                </FormField>
                <FormField>
                    <label for="">Email</label>
                    <InputText type="password"></InputText>
                </FormField>
                <Button type="submit">Login</Button>
            </Form>
        </div>
    </main>
</template>