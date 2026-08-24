<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { DEMO_SCHOOL_NUMBER, useAuthStore } from '@/stores/auth'
import { useStudentLoginMutation, validateDemoStudentCode } from '@/queries/useAuthMutations'

type FormFields = {
  studentCode: string
  studentPassword: string
  studentSchoolnumber: string
}

const router = useRouter()
const auth = useAuthStore()
const studentLogin = useStudentLoginMutation()
const surveyId = Number(import.meta.env.VITE_SURVEY_ID || 314)

const form = reactive<FormFields>({
  studentCode: '',
  studentPassword: '',
  studentSchoolnumber: '',
})

const demoAccess = reactive({ student: false })
const demoValidationPending = ref(false)
const demoError = ref('')

const errors = reactive({
  studentCode: '',
  studentPassword: '',
  studentSchoolnumber: '',
})

const isLoading = computed(() => studentLogin.isPending.value || demoValidationPending.value)
const apiError = computed(() => demoError.value || studentLogin.error.value?.message || '')

const isFormValid = computed(() => {
  if (demoAccess.student) {
    return !!form.studentSchoolnumber?.trim() && !!form.studentCode?.trim()
  }
  return !!form.studentCode?.trim() && !!form.studentPassword?.trim()
})

// Watch form fields to clear errors
watch(
  () => form.studentCode,
  () => {
    errors.studentCode = ''
    demoError.value = ''
    studentLogin.reset()
  },
)

watch(
  () => form.studentPassword,
  () => {
    errors.studentPassword = ''
    studentLogin.reset()
  },
)

watch(
  () => demoAccess.student,
  (enabled) => {
    errors.studentPassword = ''
    errors.studentSchoolnumber = ''
    form.studentSchoolnumber = enabled ? DEMO_SCHOOL_NUMBER : ''
    form.studentCode = enabled ? 'aaa' : ''
    demoError.value = ''
    studentLogin.reset()
  },
)

async function login() {
  errors.studentCode = ''
  errors.studentPassword = ''
  errors.studentSchoolnumber = ''

  if (demoAccess.student) {
    if (!form.studentSchoolnumber?.trim()) {
      errors.studentSchoolnumber = 'Du musst eine Schulnummer eingeben.'
      return
    }
    if (!form.studentCode?.trim()) {
      errors.studentCode = 'Du musst einen Code eingeben.'
      return
    }

    const normalizedCode = form.studentCode.trim()
    auth.login(form.studentSchoolnumber.trim(), 'demo-student', undefined, normalizedCode)
    demoValidationPending.value = true
    try {
      await validateDemoStudentCode(normalizedCode)
      router.replace('/step-1')
    } catch (error) {
      auth.logout()
      demoError.value = error instanceof Error ? error.message : 'Anmeldung fehlgeschlagen.'
    } finally {
      demoValidationPending.value = false
    }
    return
  }

  if (!form.studentCode?.trim()) {
    errors.studentCode = 'Du musst deinen Code eingeben.'
    return
  }

  if (!form.studentPassword?.trim()) {
    errors.studentPassword = 'Du musst dein Passwort eingeben.'
    return
  }

  const token = form.studentPassword.trim()
  const normalizedCode = form.studentCode.trim()

  try {
    const response = await studentLogin.mutateAsync({
      surveyId,
      loginPw: token,
      loginCode: normalizedCode,
    })

    const groupId = Number(response.data!.groupId)
    const testId = Number(response.data!.testId)
    const schoolId = Number(response.data!.schoolId)
    auth.login(response.data!.token, 'student', response.data!.tokenExpiresAt, normalizedCode, groupId, testId, schoolId)
    router.replace('/step-1')
  } catch {
    // The mutation error is displayed below the form.
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-content-wrapper">
        <div class="login-info-section">
          <p class="info-text-main">
            Prototypisches Rückmeldeportal im
            <a
              href="https://zepf.rptu.de/forschung/forschung-alleprojekte/tbaiii"
              target="_blank"
              class="info-link"
              >Verbundprojekt TBA III</a
            >, entwickelt vom
            <a href="https://www.kompetenztest.de" target="_blank" class="info-link"
              >Projekt <span class="info-italic">kompetenztest.de</span></a
            >
            der Friedrich-Schiller-Universität Jena.
          </p>

          <p class="info-text-secondary">
            Dieses Portal dient zu Evaluations- und Demonstationszwecken. Wenn Sie nicht Teil der Evaluation sind, können Sie sich mit dem Demo-Zugang anmelden.
          </p>

          <div class="logos-section">
            <img
              src="@/assets/images/uni-jena-logo.jpg"
              alt="Logo der Universität Jena"
              class="logo-image"
            />
            <img
              src="@/assets/images/kt-logo.png"
              alt="Logo kompetenztest.de"
              class="logo-image"
            />
          </div>
        </div>

        <div class="login-form-wrapper">
          <div class="login-form-container">
            <form @submit.prevent="login" class="login-form">
              <fieldset class="form-fieldset">
                <div class="form-group demo-access-group">
                  <label id="demo-access-label" class="form-label">Demo-Zugang</label>
                  <div class="demo-access-options" role="group" aria-labelledby="demo-access-label">
                    <button
                      type="button"
                      class="demo-access-option"
                      :class="{ 'demo-access-option-active': !demoAccess.student }"
                      :aria-pressed="!demoAccess.student"
                      @click="demoAccess.student = false"
                    >
                      Nein
                    </button>
                    <button
                      type="button"
                      class="demo-access-option"
                      :class="{ 'demo-access-option-active': demoAccess.student }"
                      :aria-pressed="demoAccess.student"
                      @click="demoAccess.student = true"
                    >
                      Ja
                    </button>
                  </div>
                </div>

                <div v-if="demoAccess.student" class="form-group">
                  <label for="studentSchoolnumber" class="form-label">Schulnummer</label>
                  <input
                    id="studentSchoolnumber"
                    v-model="form.studentSchoolnumber"
                    type="text"
                    name="studentSchoolnumber"
                    class="form-input"
                    :class="{ 'input-error': errors.studentSchoolnumber }"
                    placeholder="Schulnummer"
                    autocomplete="off"
                  />
                  <p v-if="errors.studentSchoolnumber" class="error-message">{{ errors.studentSchoolnumber }}</p>
                </div>

                <div v-if="!demoAccess.student" class="form-group">
                  <label for="studentPassword" class="form-label">Passwort</label>
                  <input
                    id="studentPassword"
                    v-model="form.studentPassword"
                    type="text"
                    name="studentPassword"
                    class="form-input"
                    :class="{ 'input-error': errors.studentPassword }"
                    placeholder="Klassenpasswort"
                    autocomplete="current-password"
                  />
                  <p v-if="errors.studentPassword" class="error-message">{{ errors.studentPassword }}</p>
                </div>

                <div class="form-group">
                  <label for="studentCode" class="form-label">Code</label>
                  <input
                    id="studentCode"
                    v-model="form.studentCode"
                    type="password"
                    name="studentCode"
                    class="form-input"
                    :class="{ 'input-error': errors.studentCode }"
                    placeholder="Schülercode"
                    autocomplete="username"
                  />
                  <p v-if="errors.studentCode" class="error-message">{{ errors.studentCode }}</p>
                </div>

                <p v-if="apiError" class="error-message" role="alert">{{ apiError }}</p>

                <button
                  type="submit"
                  :disabled="!isFormValid || isLoading"
                  class="submit-button"
                >
                    <span>{{ isLoading ? 'Anmeldung läuft...' : 'Anmelden' }}</span>
                  <svg
                    class="submit-button-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      fill="currentColor"
                      d="M13 21q-.425 0-.712-.288T12 20t.288-.712T13 19h6V5h-6q-.425 0-.712-.288T12 4t.288-.712T13 3h6q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm-1.825-8H4q-.425 0-.712-.288T3 12t.288-.712T4 11h7.175L9.3 9.125q-.275-.275-.275-.675t.275-.7t.7-.313t.725.288L14.3 11.3q.3.3.3.7t-.3.7l-3.575 3.575q-.3.3-.712.288T9.3 16.25q-.275-.3-.262-.712t.287-.688z"
                    />
                  </svg>
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  height: 100dvh;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 10px clamp(1rem, 2.5vw, 2rem) clamp(1rem, 2.5vw, 2rem);
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: auto;
  /* background: linear-gradient(180deg, #f5fbff 0%, #ffffff 100%); */
}

.login-wrapper {
  width: 100%;
  max-width: 1120px;
  margin-top: 0;
}

.login-content-wrapper {
  width: 100%;
  min-width: 365px;
  max-width: 640px;
  margin: 0 auto;
  background: transparent;
  border: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 5rem;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
}

.login-info-section {
  width: 100%;
  color: var(--color-navigation-blue);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
}

.info-text-main {
  text-align: left;
  font-size: clamp(1.125rem, 2vw, 1.35rem);
  letter-spacing: 0.025em;
  color: var(--color-navigation-blue);
  line-height: 1.7;
  margin: 0;
}

.info-link {
  color: var(--color-navigation-blue);
  font-weight: 700;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.info-link:hover,
.info-link:focus-visible {
  text-decoration: underline;
  opacity: 0.9;
}

.info-italic {
  font-style: italic;
}

.info-text-secondary {
  margin-top: 1.25rem;
  text-align: center;
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(19, 63, 120, 0.84);
}

.logos-section {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
}

.logo-image {
  width: auto;
  flex: 1 1 0;
  min-width: 0;
  max-width: 205px;
  height: auto;
  justify-self: center;
  object-fit: contain;
  opacity: 0.97;
  mix-blend-mode: multiply;
  /* filter: drop-shadow(0 6px 14px rgba(19, 63, 120, 0.08)); */
}

.logo-image:nth-child(2) {
  max-width: 270px;
}

.login-form-wrapper {
  width: 100%;
  display: flex;
  align-items: stretch;
}

.login-form-container {
  width: 100%;
  background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
  border: 1px solid oklch(87.2% 0.01 258.338);
  border-radius: 4px;
  padding: clamp(1rem, 2vw, 1.5rem);
  /* box-shadow: 0 18px 40px rgba(14, 49, 112, 0.09); */
}

.login-form {
  width: 100%;
}

.form-fieldset {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border: none;
  padding: 0;
  margin: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.demo-access-group {
  gap: 0.5rem;
}

.demo-access-options {
  display: flex;
  width: fit-content;
}

.demo-access-option {
  min-width: 3.5rem;
  min-height: 2.25rem;
  padding: 0.25rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0;
  background: var(--color-white);
  color: #4b5563;
  font-family: sans-serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.demo-access-option:hover,
.demo-access-option:focus-visible {
  position: relative;
  z-index: 1;
  border-color: #9ca3af;
  background: #f3f4f6;
}

.demo-access-option-active {
  border-color: #d1d5db;
  background: #e5e7eb;
  color: #374151;
}

.demo-access-option + .demo-access-option {
  margin-left: -1px;
}

.demo-access-option:first-child {
  border-radius: 0.375rem 0 0 0.375rem;
}

.demo-access-option:last-child {
  border-radius: 0 0.375rem 0.375rem 0;
}

.form-label {
  font-family: sans-serif;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.3;
  letter-spacing: 0.02em;
  color: var(--color-navigation-blue);
}

.form-input {
  width: 100%;
  min-height: 3.15rem;
  padding: 0.9rem 1rem;
  border: 1px solid rgba(19, 63, 120, 0.18);
  border-radius: 4px;
  background: var(--color-white);
  font-family: sans-serif;
  font-size: 1.05rem;
  line-height: 1.3;
  color: var(--color-navigation-blue);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.form-input::placeholder {
  color: rgba(19, 63, 120, 0.48);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-waterblue);
  box-shadow: 0 0 0 4px rgba(92, 124, 253, 0.12);
}

.form-input.input-error {
  border-color: #b42318;
  background: #fff5f5;
}

.error-message {
  font-size: 0.8rem;
  color: #b42318;
  margin: 0;
  line-height: 1.4;
  font-weight: 600;
}

.submit-button {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.55rem 1.25rem;
  background: #003b44;
  color: #ffffff;
  border: none;
  border-radius: 7px;
  font-weight: 700;
  font-size: 1.15rem;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
  font-family: inherit;
  margin-top: 0.25rem;
  box-shadow: 0 8px 18px rgba(7, 54, 61, 0.15);
  letter-spacing: 0.025em;
}

.submit-button-icon {
  width: 1.6rem;
  height: 1.6rem;
  flex-shrink: 0;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 22px rgba(15, 46, 126, 0.22);
}

.submit-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px rgba(92, 124, 253, 0.18), 0 14px 22px rgba(15, 46, 126, 0.18);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  box-shadow: none;
}

@media (min-width: 1024px) {
  .login-wrapper {
    margin-top: 5rem;
  }

  .login-content-wrapper {
    max-width: none;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 5.5rem;
    padding: 0;
  }

  .login-info-section {
    width: 100%;
    max-width: 40rem;
    flex: 1;
    min-height: 24rem;
  }

  .info-text-main,
  .info-text-secondary {
    text-align: left;
  }


  .login-form-wrapper {
    flex: 0 1 28rem;
  }
}
</style>
