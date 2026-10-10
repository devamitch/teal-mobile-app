import {PrimaryButton} from '@/components/ui';
import React from 'react';
import {ScrollView, View, Text, StyleSheet, Button} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {lightTheme} from '@/constants';

const TERMS = [
  {
    title: '1) Introduction & Who We Are',
    content: `These Terms of Service (“Terms”) govern your access to and use of the MyAura Wellness Mobile/ web application and website myteal.ca (collectively, the “Service”). The Service is operated by Aura Medical Technologies Inc. (“AuraCore,” “we,” “us,” or “our”) in collaboration with IAPMD Canada (“IAPMD”).\n\nBy creating an account, downloading, or using the Service, you agree to these Terms. If you do not agree, do not use the Service.\n\nNot Medical Advice. MyTeal provides general wellness and educational content about women’s mental and reproductive health. It is not a substitute for professional medical advice, diagnosis, or treatment, and it is not an emergency or crisis service. If you are in danger or experiencing a medical or mental health emergency, call 911 (or your local emergency number) immediately.`,
  },
  {
    title: '2) Eligibility & Accounts',
    content: `Age. You must be 18+ to use the Service. By using the Service, you represent and warrant you meet this requirement.\n\nRegistration. You agree to provide accurate, current, and complete information and to keep it updated.\n\nSecurity. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. Notify us immediately of any unauthorized use.`,
  },
  {
    title: '3) Acceptable Use',
    content: `You agree you will not:\n- Use the Service for unlawful, harmful, fraudulent, or misleading purposes.\n- Interfere with or disrupt the Service’s integrity, performance, or security.\n- Attempt to gain unauthorized access to the Service, accounts, or related networks.\n- Upload or transmit malware, viruses, or harmful code.\n- Reverse engineer, scrape, or create derivative works from the Service except as allowed by law or these Terms.\n- Use the Service to provide emergency monitoring or life-critical functions.`,
  },
  {
    title: '4) Content & Intellectual Property',
    content: `Ownership. The Service, including text, graphics, UI, logos, images, data, and software, is owned by AuraCore (and, where applicable, its licensors, including IAPMD) and protected by intellectual property laws.\n\nYour License to Use. We grant you a limited, personal, non-exclusive, non-transferable, revocable license to access and use the Service for your own non-commercial wellness use, subject to these Terms.\n\nUser Content. If you submit content (e.g., journal entries, notes, feedback), you represent you have the right to do so and grant AuraCore a worldwide, royalty-free, sublicensable license to use, host, store, reproduce, modify, and display that content solely to operate, improve, and provide the Service. You remain the owner of your content.\n\nFeedback. If you send ideas or suggestions, you grant AuraCore the right to use them without restriction or compensation.`,
  },
  {
    title: '5) Privacy, Data Practices & Security',
    content: `No Sale of Personal Data. MyTeal does not sell or commercialize user data.\n\nUse of Data. We use personal information to operate, provide, secure, and improve the Service; personalize features; and comply with law. We may share data with service providers (e.g., hosting, analytics, support) under contracts that require confidentiality and prohibit data selling or independent use.\n\nSecurity. We use industry-standard safeguards to protect data in transit and at rest and maintain secure handling practices designed to protect sensitive information. However, no system can be guaranteed 100% secure.\n\nSensitive Wellness Data. The Service may process information about mental and reproductive health that you choose to input. Only enter information you are comfortable sharing under these Terms and our Privacy Policy.\n\nThird-Party Services & Devices. If you connect third-party apps, wearables, or services, their privacy practices apply to their handling of your data. We are not responsible for third-party products or policies.\n\nPrivacy Policy. Additional details are provided in our Privacy Policy (linked in-app/website). In the event of conflict, these Terms control with respect to your contractual relationship with AuraCore.`,
  },
  {
    title: '6) Health & Safety Disclaimers',
    content: `The Service may include self-assessments, educational content, tracking tools, and general guidance. These are informational only and may not be accurate for your specific situation. Always consult a qualified health professional for advice.\n\nAuraCore and IAPMD do not practice medicine or provide clinical care through MyTeal.\n\nThe Service is not intended for crisis response, suicide prevention, or emergencies.`,
  },
  {
    title: '7) Changes & Updates to the Service',
    content: `We may modify, suspend, or discontinue any part of the Service at any time, including features labeled as beta or experimental. We may push automatic updates to your app to improve performance or security.`,
  },
  {
    title: '8) Subscriptions, Fees & Trials (If Applicable)',
    content: `We may offer free or paid tiers, trials, or promotions. Any fees, billing terms, renewal periods, cancellation rights, and refund policies will be disclosed at purchase. If you subscribe via Apple App Store or Google Play, their terms and billing rules apply and may govern cancellations and refunds.`,
  },
  {
    title: '9) Third-Party Links & Resources',
    content: `The Service may reference third-party resources (e.g., articles, helplines). We do not endorse and are not responsible for third-party content, products, or services.`,
  },
  {
    title: '10) Geographic & Regulatory Notes',
    content: `The Service is operated from Canada and is primarily intended for users in Canada. If you access from other jurisdictions, you do so at your own risk and are responsible for compliance with local laws.`,
  },
  {
    title: '11) Disclaimers',
    content: `THE SERVICE IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS, WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY, OR RELIABILITY. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE, OR THAT DEFECTS WILL BE CORRECTED.`,
  },
  {
    title: '12) Limitation of Liability',
    content: `TO THE FULLEST EXTENT PERMITTED BY LAW, AuraCore, ITS AFFILIATES, DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, PARTNERS (INCLUDING IAPMD), AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES; LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS INTERRUPTION; OR PERSONAL INJURY OR PROPERTY DAMAGE ARISING FROM OR RELATED TO YOUR USE OF (OR INABILITY TO USE) THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.\n\nIN NO EVENT SHALL THE TOTAL LIABILITY OF AuraCore AND ITS AFFILIATES ARISING OUT OF OR RELATING TO THE SERVICE EXCEED THE GREATER OF (A) CAD $10 OR (B) THE AMOUNTS YOU PAID TO AuraCore FOR THE SERVICE IN THE 3 MONTHS PRIOR TO THE EVENT GIVING RISE TO THE CLAIM (IF ANY). SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS; SOME LIMITS MAY NOT APPLY TO YOU.`,
  },
  {
    title: '13) Indemnification',
    content: `You agree to indemnify, defend, and hold harmless AuraCore and its affiliates, officers, directors, employees, agents, and licensors from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable legal fees) arising out of or related to: (a) your use of the Service; (b) your violation of these Terms; (c) your content; or (d) your violation of any law or third-party right.`,
  },
  {
    title: '14) Suspension & Termination',
    content: `We may suspend or terminate your access to the Service (including without notice in urgent cases) if we believe you have violated these Terms, pose a security risk, or create potential liability for us. You may stop using the Service at any time and request account deletion through in-app settings or support.`,
  },
  {
    title: '15) Governing Law; Dispute Resolution',
    content: `Law. These Terms are governed by the laws of the Province of Alberta, Canada, without regard to conflict-of-law principles.\n\nArbitration. Any dispute arising out of or relating to these Terms or the Service shall be resolved by binding arbitration under the rules of the Canadian Arbitration Association. The seat and venue shall be Edmonton, Alberta. The language shall be English. Judgment on the award may be entered in any court of competent jurisdiction.\n\nNo Class Actions (to the extent permitted). Disputes must be brought in your individual capacity, not as a plaintiff or class member in any class or representative action.\n\nInjunctive Relief. Nothing prevents AuraCore from seeking urgent injunctive or equitable relief in court to protect its rights (e.g., IP, security, confidentiality).`,
  },
  {
    title: '16) App Stores & Platform Terms',
    content: `If you downloaded MyTeal from the Apple App Store or Google Play, you also agree to their applicable terms. Apple and Google are not responsible for providing maintenance or support for the Service and have no warranty or liability obligations regarding the Service.`,
  },
  {
    title: '17) Compliance, Export & Sanctions',
    content: `You represent you are not located in, under control of, or a resident of any country or entity embargoed by Canada or your local jurisdiction and that you will comply with applicable export, sanctions, and anti-corruption laws.`,
  },
  {
    title: '18) Changes to These Terms',
    content: `We may update these Terms from time to time. For material changes, we will provide at least 30 days’ notice (e.g., in-app notice or email, where available) before the new terms take effect. Your continued use after the effective date constitutes acceptance of the revised Terms.`,
  },
  {
    title: '19) Miscellaneous',
    content: `Entire Agreement. These Terms are the entire agreement between you and AuraCore regarding the Service and supersede prior agreements.\n\nSeverability. If any provision is found unenforceable, the remaining provisions remain in effect.\n\nNo Waiver. A failure to enforce a right is not a waiver.\n\nAssignment. You may not assign or transfer these Terms without our prior written consent. We may assign these Terms in connection with a merger, acquisition, or sale of assets.\n\nHeadings. Headings are for convenience only.`,
  },
  {
    title: '20) Contact',
    content: `Questions about these Terms or the Service?\n\nAura Medical Technologies Inc.\nEmail: info@AuraCoremedical.com\nSubject line: MyTeal – Terms of Service`,
  },
];
export default function TermsOfServiceScreen() {
  const [accepted, setAccepted] = React.useState(false);
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>MyTeal Terms of Service</Text>

        <Text style={styles.date}>Last updated: August 12, 2025</Text>
        {TERMS.map((section, idx) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}
        <View style={styles.acceptContainer}>
          <View style={styles.checkboxRow}>
            <CheckBox
              checked={accepted}
              onPress={() => setAccepted(!accepted)}
              checkedColor={lightTheme.primary}
              uncheckedColor="#ccc"
              containerStyle={styles.checkbox}
            />
            <Text style={styles.acceptText}>I accept</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton
            text="Go Back"
            onPress={() => {
              if (accepted) {
                navigation.goBack();
              }
            }}
            disabled={!accepted}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 8,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
    top: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 28,
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  acceptContainer: {
    marginLeft: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 8,
  },
  acceptText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
});
