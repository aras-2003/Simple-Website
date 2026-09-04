apiVersion: v1
kind: Namespace
metadata:
  name: {{NAMESPACE}}
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: personal-site
  namespace: {{NAMESPACE}}
  labels:
    app.kubernetes.io/name: personal-site
spec:
  replicas: 2
  revisionHistoryLimit: 3
  strategy:
    type: RollingUpdate
    rollingUpdate: { maxUnavailable: 0, maxSurge: 1 }
  selector:
    matchLabels:
      app.kubernetes.io/name: personal-site
  template:
    metadata:
      labels:
        app.kubernetes.io/name: personal-site
    spec:
      automountServiceAccountToken: false
      securityContext:
        seccompProfile: { type: RuntimeDefault }
      containers:
        - name: web
          image: {{IMAGE}}
          imagePullPolicy: IfNotPresent
          ports:
            - { name: http, containerPort: 8080 }
          readinessProbe:
            httpGet: { path: /healthz, port: http }
            initialDelaySeconds: 3
            periodSeconds: 10
          livenessProbe:
            httpGet: { path: /healthz, port: http }
            initialDelaySeconds: 10
            periodSeconds: 20
          resources:
            requests: { cpu: 20m, memory: 24Mi }
            limits: { cpu: 200m, memory: 96Mi }
          volumeMounts:
            - { name: tmp, mountPath: /tmp }
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            runAsNonRoot: true
            capabilities: { drop: ["ALL"] }
        - name: contact-api
          image: {{CONTACT_IMAGE}}
          imagePullPolicy: IfNotPresent
          ports:
            - { name: contact, containerPort: 8787 }
          env:
            - { name: CONTACT_DRY_RUN, value: "0" }
            - { name: CONTACT_REQUIRE_ORIGIN, value: "1" }
            - name: RESEND_API_KEY
              valueFrom: { secretKeyRef: { name: personal-site-contact, key: RESEND_API_KEY } }
            - name: CONTACT_TO_EMAIL
              valueFrom: { secretKeyRef: { name: personal-site-contact, key: CONTACT_TO_EMAIL } }
            - name: CONTACT_FROM_EMAIL
              valueFrom: { secretKeyRef: { name: personal-site-contact, key: CONTACT_FROM_EMAIL } }
            - name: CONTACT_ALLOWED_ORIGINS
              value: "https://{{HOST}}"
          readinessProbe:
            httpGet: { path: /healthz, port: contact }
            initialDelaySeconds: 3
            periodSeconds: 10
          livenessProbe:
            httpGet: { path: /healthz, port: contact }
            initialDelaySeconds: 10
            periodSeconds: 20
          resources:
            requests: { cpu: 10m, memory: 24Mi }
            limits: { cpu: 150m, memory: 80Mi }
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            runAsNonRoot: true
            capabilities: { drop: ["ALL"] }
      volumes:
        - name: tmp
          emptyDir: { sizeLimit: 16Mi }
---
apiVersion: v1
kind: Service
metadata:
  name: personal-site
  namespace: {{NAMESPACE}}
spec:
  selector:
    app.kubernetes.io/name: personal-site
  ports:
    - { name: http, port: 80, targetPort: http }
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: personal-site
  namespace: {{NAMESPACE}}
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  tls:
    - hosts: ["{{HOST}}"]
      secretName: personal-site-tls
  rules:
    - host: "{{HOST}}"
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: personal-site
                port: { name: http }
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: personal-site
  namespace: {{NAMESPACE}}
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: personal-site }
  minReplicas: 2
  maxReplicas: 6
  behavior:
    scaleDown: { stabilizationWindowSeconds: 300 }
  metrics:
    - type: Resource
      resource:
        name: cpu
        target: { type: Utilization, averageUtilization: 70 }
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: personal-site
  namespace: {{NAMESPACE}}
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app.kubernetes.io/name: personal-site
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: personal-site
  namespace: {{NAMESPACE}}
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: personal-site
  policyTypes: ["Ingress", "Egress"]
  ingress:
    - ports:
        - { protocol: TCP, port: 8080 }
  egress:
    - ports:
        - { protocol: UDP, port: 53 }
        - { protocol: TCP, port: 53 }
    - ports:
        - { protocol: TCP, port: 443 }
